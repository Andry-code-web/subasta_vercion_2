const { conection } = require("../database/db");

class BotUserService {
  static async ensureBotsRegistered(bots) {
    try {
      for (const bot of bots) {
        await this.ensureBotRegistered(bot.bot_name);
      }
    } catch (error) {
      console.error('[BotUserService] Error al registrar bots:', error);
    }
  }

  static async ensureBotRegistered(botName) {
    try {
      // Verificar si el bot ya está registrado
      const [existing] = await conection.promise().query(
        'SELECT id FROM usuarios WHERE usuario = ?',
        [botName]
      );
  
      if (existing.length === 0) {
        // Si no existe, registrar el bot como usuario
        await conection.promise().query(
          `INSERT INTO usuarios 
           (tipo_persona, email, confirmacion_email, celular, usuario, contraseña, oportunidades) 
           VALUES 
           (?, ?, ?, ?, ?, ?, ?)`,
          [
            'juridica', // tipo_persona
            `${botName.toLowerCase()}@bot.com`, // email
            'confirmado', // confirmacion_email
            '0000000000', // celular (placeholder genérico)
            botName, // usuario
            'bot123', // contraseña
            999, // oportunidades
          ]
        );
        console.log(`[BotUserService] Bot ${botName} registrado como usuario`);
      }
    } catch (error) {
      console.error(`[BotUserService] Error al registrar bot ${botName}:`, error);
    }
  }
  
}

module.exports = BotUserService;