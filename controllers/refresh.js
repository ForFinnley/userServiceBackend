const { getRefresh, getUser } = require('./utils/database.js');
const { authenticateRefresh, generateToken } = require('./utils/jwt.js');
const {
  InvalidCredentialsError,
  ResourceExistsError,
  resolveErrorSendResponse
} = require('./utils/errors.js');

module.exports.handler = async function(req, res) {
  try {
    const refreshToken = req.headers.authorization;
    const decryptToken = await authenticateRefresh(refreshToken);
    if (!decryptToken) throw new InvalidCredentialsError('unauthorized');

    //TODO :: refresh table should have ttl so old refreshTokens get deleted
    //ALSO MAYBE CHECK USERID MATCHES?
    const refreshRecord = await getRefresh(refreshToken);
    if (!refreshRecord) throw new ResourceExistsError('invalid refresh token');

    const user = await getUser(refreshRecord.userId);
    const authorizationToken = generateToken(user);

    return res.status(200).send({
      authorizationToken,
      refreshToken
    });
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};