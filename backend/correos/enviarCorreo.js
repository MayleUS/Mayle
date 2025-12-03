const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CORREO_EMPRESA,
    pass: process.env.CLAVE_CORREO
  }
});

// ✅ Correo simple de registro (respaldo)
const enviarCorreoRegistro = async (destinatario, nombre) => {
  const mailOptions = {
    from: process.env.CORREO_EMPRESA,
    to: destinatario,
    subject: '¡Registro exitoso!',
    text: `Hola ${nombre}, gracias por registrarte en nuestra plataforma.`
  };
  await transporter.sendMail(mailOptions);
};

// ✅ Correo simple personalizado (texto plano)
const enviarCorreo = async (destinatario, asunto, mensaje) => {
  const mailOptions = {
    from: process.env.CORREO_EMPRESA,
    to: destinatario,
    subject: asunto,
    text: mensaje
  };
  await transporter.sendMail(mailOptions);
};

// ✅ Correo con código de verificación en HTML
const enviarCodigoVerificacion = async (correo, nombre, codigo) => {
  const mailOptions = {
    from: process.env.CORREO_EMPRESA,
    to: correo,
    subject: 'Verifica tu cuenta - Código de verificación',
    html: `
      <h2>Hola ${nombre} 👋</h2>
      <p>Gracias por registrarte en <strong>Beubek</strong>.</p>
      <p>Tu código de verificación es:</p>
      <h3 style="color: #6e1212; font-size: 24px;">${codigo}</h3>
      <p>Este código es válido por 15 minutos.</p>
      <br>
      <p style="font-size: 12px; color: gray;">Si no solicitaste este registro, puedes ignorar este mensaje.</p>
    `
  };
  await transporter.sendMail(mailOptions);
};

// ✅ Correo bonito de bienvenida
const enviarCorreoRegistroExitoso = async (correo, nombre) => {
  const mailOptions = {
    from: process.env.CORREO_EMPRESA,
    to: correo,
    subject: '🎉 ¡Bienvenido a Beubek!',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #6e1212;">¡Hola ${nombre} 👋!</h2>
          <p>Tu cuenta ha sido creada exitosamente en <strong>Beubek</strong>.</p>
          <p>Gracias por unirte a nuestra comunidad. Ahora puedes explorar nuestras colecciones, hacer pedidos y estar al tanto de nuestras novedades.</p>
          <p>Podrás disfrutar de un 10% de descuento en tu primera compra con el cupón <strong>B3UB3k10</strong>.</p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 13px; color: #999;">Si no realizaste este registro, puedes ignorar este correo.</p>
        </div>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

// ✅ Correo al cliente con resumen del pedido
const enviarCorreoClientePedido = async (correo, nombre, pedido) => {
  const subtotal = pedido.productos.reduce((acc, p) => acc + (p.precio_total || 0), 0);
  const descuentoPorcentaje = typeof pedido.descuento_aplicado === 'number' ? pedido.descuento_aplicado : 0;
  const descuentoValor = Math.round(subtotal * (descuentoPorcentaje / 100));
  const envio = pedido.valor_envio || 0;
  const totalFinal = subtotal - descuentoValor + envio;
  const fecha = pedido.fecha_pedido || 'Fecha no disponible';

  const productosHTML = pedido.productos.map(prod => {
    const nombre = prod.nombre || 'Producto';
    const cantidad = prod.cantidad || 0;
    const precioUnitario = `$${(prod.precio_unitario || 0).toLocaleString('es-CO')}`;
    const precioTotal = `$${(prod.precio_total || 0).toLocaleString('es-CO')}`;
    const talla = prod.talla || 'N/A';
    const colores = Array.isArray(prod.color)
      ? prod.color.filter(c => !c.startsWith('#')).join(', ')
      : prod.color || 'N/A';

    return `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${nombre}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${talla}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${colores}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${cantidad}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${precioUnitario}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${precioTotal}</td>
      </tr>`;
  }).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
      <div style="max-width: 700px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://res.cloudinary.com/dvj1tw3ui/image/upload/v1752191558/logo_xmxoz3.png" alt="Beubek Logo" style="max-width: 180px;" />
        </div>

        <h2 style="color: #6e1212;">¡Gracias por tu pedido, ${nombre}! 🛍️</h2>
        <p>Hemos recibido tu compra con éxito. Aquí te dejamos los detalles:</p>

        <p><strong>ID del pedido:</strong> ${pedido._id}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>

        <h3 style="margin-top: 30px;">🧾 Resumen de tu compra</h3>
        <table style="border-collapse: collapse; width: 100%; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd;">Producto</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Talla</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Color</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Precio unitario</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Precio total</th>
            </tr>
          </thead>
          <tbody>
            ${productosHTML}
          </tbody>
        </table>

        <h3 style="margin-top: 30px;">💳 Detalle del pago</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Subtotal:</strong> $${subtotal.toLocaleString('es-CO')}</li>
          <li><strong>Descuento:</strong> ${descuentoPorcentaje}% (-$${descuentoValor.toLocaleString('es-CO')})</li>
          <li><strong>Envío:</strong> $${envio.toLocaleString('es-CO')}</li>
          <li><strong style="color: green;">Total pagado:</strong> $${totalFinal.toLocaleString('es-CO')}</li>
        </ul>

        <p style="margin-top: 30px;">Te avisaremos cuando tu pedido haya sido despachado.</p>
        <p style="font-size: 12px; color: gray; margin-top: 40px;">Gracias por confiar en Beubek 💖</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.CORREO_EMPRESA,
    to: correo,
    subject: `🎉 Gracias por tu compra en Beubek, ${nombre}`,
    html
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Correo HTML al vendedor con resumen del pedido
const notificarPedidoAVendedor = async (pedido) => {
  const destinatario = process.env.CORREO_VENDEDOR;

  const subtotal = pedido.productos.reduce((acc, p) => acc + (p.precio_total || 0), 0);
  const descuentoPorcentaje = typeof pedido.descuento_aplicado === 'number' ? pedido.descuento_aplicado : 0;
  const descuentoValor = Math.round(subtotal * (descuentoPorcentaje / 100));
  const envio = pedido.valor_envio || 0;
  const totalFinal = subtotal - descuentoValor + envio;

  const cliente = pedido.nombre_cliente || 'Cliente anónimo';
  const correo = pedido.correo_cliente || 'Sin correo';
  const celular = pedido.celular_cliente || 'Sin celular';
  const direccion = pedido.direccion_envio || 'Sin dirección';
  const fecha = pedido.fecha_pedido || 'Fecha no disponible';

  const productosHTML = pedido.productos.map((prod, index) => {
    const nombre = prod.nombre || 'Producto';
    const cantidad = prod.cantidad || 0;
    const precioUnitario = `$${(prod.precio_unitario || 0).toLocaleString('es-CO')}`;
    const precioTotal = `$${(prod.precio_total || 0).toLocaleString('es-CO')}`;
    const talla = prod.talla || 'N/A';
    const colores = Array.isArray(prod.color)
      ? prod.color.filter(c => typeof c === 'string' && !c.startsWith('#')).join(', ')
      : typeof prod.color === 'string' && !prod.color.startsWith('#') ? prod.color : 'N/A';

    return `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${nombre}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${talla}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${colores}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${cantidad}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${precioUnitario}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${precioTotal}</td>
      </tr>`;
  }).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 700px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">

        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://res.cloudinary.com/dvj1tw3ui/image/upload/v1752191558/logo_xmxoz3.png" alt="Beubek Logo" style="max-width: 180px;" />
        </div>

        <h2 style="color: #6e1212;">📦 Nuevo Pedido Recibido</h2>
        <p><strong>ID del pedido:</strong> ${pedido._id}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>

        <h3>👤 Datos del cliente</h3>
        <p><strong>Nombre:</strong> ${cliente}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Celular:</strong> ${celular}</p>
        <p><strong>Dirección:</strong> ${direccion}</p>

        <h3>🛍️ Productos</h3>
        <table style="border-collapse: collapse; width: 100%; border: 1px solid #ddd; text-align: left;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th>#</th>
              <th>Producto</th>
              <th>Talla</th>
              <th>Colores</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Precio total</th>
            </tr>
          </thead>
          <tbody>
            ${productosHTML}
          </tbody>
        </table>

        <h3>💳 Detalle de pago</h3>
        <ul>
          <li><strong>Pedido:</strong> $${subtotal.toLocaleString('es-CO')}</li>
          <li><strong>Descuento:</strong> ${descuentoPorcentaje}% (-$${descuentoValor.toLocaleString('es-CO')})</li>
          <li><strong>Envío:</strong> $${envio.toLocaleString('es-CO')}</li>
          <li><strong style="color: green;">Total del pedido:</strong> $${totalFinal.toLocaleString('es-CO')}</li>
        </ul>

        <p style="font-size: 12px; color: gray; margin-top: 40px;">Consulta más detalles en el panel de administración.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.CORREO_EMPRESA,
    to: destinatario,
    subject: '🛒 ¡Nuevo pedido recibido!',
    html
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Exportar todas las funciones
module.exports = {
  enviarCorreo,
  enviarCodigoVerificacion,
  notificarPedidoAVendedor,
  enviarCorreoRegistro,
  enviarCorreoRegistroExitoso,
  enviarCorreoClientePedido
};