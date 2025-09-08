import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, firstName } = await req.json()

    // Here you would integrate with your email service (SendGrid, Mailgun, etc.)
    // For now, we'll just log the email that would be sent
    console.log(`Sending welcome email to: ${email}`)
    console.log(`First name: ${firstName}`)

    // Example email content that would be sent:
    const emailContent = {
      to: email,
      subject: 'Добре дошли в Bat Petko Store! 🐾',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Добре дошли в Bat Petko Store! 🐾</h1>
          </div>
          
          <div style="padding: 40px 20px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Здравейте, ${firstName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Благодарим ви, че се присъединихте към нашата общност от любители на домашни любимци! 
              Ние сме развълнувани да ви помогнем да се грижите за вашите четириноги приятели.
            </p>
            
            <div style="background: white; padding: 30px; border-radius: 10px; margin: 30px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Какво можете да очаквате:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>🎯 Персонализирани препоръки за продукти</li>
                <li>🚚 Безплатна доставка при поръчки над 50 лв</li>
                <li>💰 Ексклузивни отстъпки и промоции</li>
                <li>📚 Полезни съвети за грижа за домашни любимци</li>
                <li>⭐ Програма за лоялност с награди</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://yourstore.com/products" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold;
                        display: inline-block;">
                Започнете пазаруването
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-top: 30px;">
              Ако имате въпроси, не се колебайте да се свържете с нас на 
              <a href="mailto:info@petstore.bg" style="color: #667eea;">info@petstore.bg</a> 
              или 0888 123 456.
            </p>
            
            <p style="color: #666; margin-top: 20px;">
              С най-добри пожелания,<br>
              <strong>Екипът на Bat Petko Store</strong>
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © 2024 Bat Petko Store. Всички права запазени.
            </p>
          </div>
        </div>
      `
    }

    // In a real implementation, you would send the email here
    // Example with SendGrid:
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email }] }],
    //     from: { email: 'noreply@petstore.bg', name: 'Bat Petko Store' },
    //     subject: emailContent.subject,
    //     content: [{ type: 'text/html', value: emailContent.html }]
    //   })
    // })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Welcome email queued for sending',
        emailContent // For demo purposes, return the email content
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending welcome email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})