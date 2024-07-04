import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo'

const apiInstace = new TransactionalEmailsApi();
const API_KEY_BRE = process.env.API_KEY_BREVO || '';

apiInstace.setApiKey(
    TransactionalEmailsApiApiKeys.apiKey,
    API_KEY_BRE
)

export const sendEmail = async (sendSmtpEmail: any) => {

    try {
        await apiInstace.sendTransacEmail(sendSmtpEmail);

    } catch (error) {
        console.log({
            error
        })
    }

}