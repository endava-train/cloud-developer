import {CustomAuthorizerEvent, CustomAuthorizerResult} from 'aws-lambda';
import 'source-map-support/register';

import {verify} from 'jsonwebtoken';
import {getLogger} from '../../utils/logger';
import {JwtPayload} from '../../auth/JwtPayload';
import axios from 'axios';

const log = getLogger();

const jwksUrl = 'https://dev-4kascpa8.us.auth0.com/.well-known/jwks.json';

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  log.info('Authorizing a user', event.authorizationToken);
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    log.info('User was authorized', jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          },
        ]
      }
    }
  } catch (e) {
    log.error('User not authorized', { error: e.message });

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

const getCert = function() {
  let certCache;
  return async () => {
    if (!certCache) {
      const response = await axios.get(jwksUrl);
      log.info(response.status.toString());
      certCache = response.data.keys
        .find(key => key.use === 'sig'
          && key.kty === 'RSA'
          && key.x5c && key.x5c.length
        );
      [certCache] = certCache.x5c;
      certCache = certToPEM(certCache);
      log.info("cert cached");
    }
    return certCache;
  }
}();

function certToPEM(cert) {
  cert = cert.match(/.{1,64}/g).join('\n');
  return `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);
  const cert = await getCert();
  return verify(
    token,
    cert,
    {algorithms: ['RS256']},
  ) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) {
    throw new Error('No authentication header');
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authentication header');
  }

  const split = authHeader.split(' ');
  const token = split[1];

  return token;
}
