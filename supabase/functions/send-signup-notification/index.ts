import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SignupNotificationRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SignupNotificationRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send notification email to the user
    const emailResponse = await resend.emails.send({
      from: "KDM - Karim Dashboard Manager <onboarding@resend.dev>",
      to: [email],
      subject: "Terima kasih telah mendaftar - KDM",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p style="font-size: 16px; color: #333;">Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
          
          <p style="font-size: 16px; color: #333;">Terima kasih telah mendaftarkan email Anda! 🌸</p>
          
          <p style="font-size: 16px; color: #333;">
            Kami telah menerima permintaan Anda untuk mendapatkan notifikasi pembukaan pendaftaran 
            <strong>KDM – Karim Dashboard Manager</strong> pada periode berikutnya.<br>
            Begitu pendaftaran dibuka kembali, kami akan segera mengirimkan informasi lengkap melalui email ini.
          </p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 14px; color: #555; margin: 5px 0;">
              <strong>Jika ada pertanyaan, silakan hubungi kami di:</strong>
            </p>
            <p style="font-size: 14px; color: #555; margin: 5px 0;">
              📧 support@insankarim.com
            </p>
            <p style="font-size: 14px; color: #555; margin: 5px 0;">
              🌐 <a href="https://insankarim.com" style="color: #2563eb;">https://insankarim.com</a>
            </p>
          </div>
          
          <p style="font-size: 16px; color: #333;">Barakallahu fiikum,</p>
          <p style="font-size: 16px; color: #333; margin-bottom: 5px;">
            <strong>Tim KDM – Karim Dashboard Manager</strong>
          </p>
          <p style="font-size: 14px; color: #666; font-style: italic;">
            ~Membangun Generasi Karim: Knowledgeable, Active, Responsible, Islamic Manner~
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Also send notification to admin
    await resend.emails.send({
      from: "KDM - Karim Dashboard Manager <onboarding@resend.dev>",
      to: ["nashers.manziel@gmail.com"],
      subject: "Pendaftaran Email Baru - KDM",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Pendaftaran Email Baru</h2>
          <p style="font-size: 16px; color: #333;">
            Ada pendaftaran email baru untuk notifikasi KDM:
          </p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 14px; color: #555; margin: 5px 0;">
              <strong>Email:</strong> ${email}
            </p>
            <p style="font-size: 14px; color: #555; margin: 5px 0;">
              <strong>Tanggal:</strong> ${new Date().toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-signup-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
