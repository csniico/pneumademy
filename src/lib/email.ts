import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "Pneumademy <no-reply@csniico.site>";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
    await resend.emails.send({
        from: FROM_ADDRESS,
        to,
        subject: "Reset your Pneumademy password",
        html: `
            <p>Hi,</p>
            <p>You requested a password reset for your Pneumademy account.</p>
            <p>
                <a href="${resetUrl}" style="color:#7C3AED;font-weight:bold;">
                    Reset your password
                </a>
            </p>
            <p>This link expires in 1 hour. If you did not request a reset, you can safely ignore this email.</p>
            <p>— The Pneumademy Team</p>
        `,
    });
}

export async function sendVerificationEmail(to: string, verifyUrl: string) {
    await resend.emails.send({
        from: FROM_ADDRESS,
        to,
        subject: "Verify your Pneumademy email",
        html: `
            <p>Hi,</p>
            <p>Welcome to Pneumademy. Please verify your email address to get started.</p>
            <p>
                <a href="${verifyUrl}" style="color:#7C3AED;font-weight:bold;">
                    Verify my email
                </a>
            </p>
            <p>If you did not create an account, you can safely ignore this email.</p>
            <p>— The Pneumademy Team</p>
        `,
    });
}
