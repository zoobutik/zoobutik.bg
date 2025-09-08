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
    const { email, discountCode } = await req.json()

    console.log(`Sending newsletter subscription email to: ${email}`)
    console.log(`Discount code: ${discountCode}`)

    // Example email content for newsletter subscription
    const emailContent = {
      to: email,
      subject: 'Благодарим за абонирането! Ето вашият код за отстъпка 🎁',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Благодарим за абонирането! 🎁</h1>
          </div>
          
          <div style="padding: 40px 20px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Вашият код за отстъпка е готов!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Благодарим ви, че се абонирахте за нашия бюлетин! Като знак на благодарност, 
              ви даваме специален код за 10% отстъпка от следващата ви поръчка.
            </p>
            
            <div style="background: white; padding: 30px; border-radius: 10px; margin: 30px 0; text-align: center; border: 2px dashed #10b981;">
              <h3 style="color: #333; margin-bottom: 15px;">Вашият код за отстъпка:</h3>
              <div style="background: #10b981; color: white; padding: 20px; border-radius: 10px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                ${discountCode}
              </div>
              <p style="color: #666; margin-top: 15px; font-size: 14px;">
                Валиден 30 дни от днес | Еднократна употреба
              </p>
            </div>
            
            <div style="background: #e6fffa; padding: 20px; border-radius: 10px; margin: 30px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Как да използвате кода:</h3>
              <ol style="color: #666; line-height: 1.8;">
                <li>Добавете желаните продукти в количката</li>
                <li>Отидете на страницата за поръчка</li>
                <li>Въведете кода в полето "Код за отстъпка"</li>
                <li>Натиснете "Приложи" и се насладете на отстъпката!</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://yourstore.com/products" 
                 style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold;
                        display: inline-block;">
                Започнете пазаруването
              </a>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 30px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Какво да очаквате от нашия бюлетин:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>🎯 Ексклузивни оферти само за абонати</li>
                <li>🐾 Съвети за грижа за домашни любимци</li>
                <li>🆕 Първи достъп до нови продукти</li>
                <li>📅 Сезонни промоции и специални събития</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-top: 30px;">
              Ако имате въпроси, не се колебайте да се свържете с нас на 
              <a href="mailto:info@petstore.bg" style="color: #10b981;">info@petstore.bg</a> 
              или 0888 123 456.
            </p>
            
            <p style="color: #666; margin-top: 20px;">
              С най-добри пожелания,<br>
              <strong>Екипът на Bat Petko Store</strong>
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © 2024 Bat Petko Store. Всички права запазени.<br>
              <a href="#" style="color: #999;">Отписване от бюлетина</a>
            </p>
          </div>
        </div>
      `
    }

    // In a real implementation, you would send the email here
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Newsletter email queued for sending',
        emailContent // For demo purposes
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending newsletter email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})