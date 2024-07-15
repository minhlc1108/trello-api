import SibApiV3Sdk from 'sib-api-v3-sdk'
import { env } from '~/config/environment'
import { CLIENT_ROOT } from '~/utils/constants'

const defaultClient = SibApiV3Sdk.ApiClient.instance

const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = env.API_KEY
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

const sendEmailVerification = async (params) => {
  const link = `${CLIENT_ROOT}/account/verification?email=${params.email}&token=${params.token}`
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
  sendSmtpEmail.subject = 'Verifcation account to use Trello Clone'
  sendSmtpEmail.htmlContent = `<html>
  <h3>Here is your verification link:</h3>
  <a href='${link}'>${link}</a>
  <br>
  <b>-Admin Trello Clone-</b>
  </html>`
  sendSmtpEmail.sender = { 'name': 'Admin Trello Clone', 'email': 'adm.trelloclonez@gmail.com' }
  sendSmtpEmail.to = [{ email: params.email, name: params.username }]
  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail)
  } catch (error) {
    throw error
  }
}

export const emailProvider = {
  sendEmailVerification
}