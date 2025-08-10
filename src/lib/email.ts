import emailjs from 'emailjs-com'

export function enviarCorreoDeSoporte(name: string, mensaje: string) {
  return emailjs.send(
    'service_bucu8vo',              // ID de servicio
    'template_dyxexy8',             // ID de plantilla
    { name, mensaje },              // variables para tu plantilla
    'TgAyhcGi-BA2UFJXB'               // ⚠️ Reemplaza esto por tu PUBLIC KEY de EmailJS
  )
}
