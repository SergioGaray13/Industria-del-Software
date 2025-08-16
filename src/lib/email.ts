import emailjs from 'emailjs-com'

export function enviarCorreoDeSoporte(name: string, mensaje: string) {
  return emailjs.send(
    'service_bucu8vo',            
    'template_dyxexy8',            
    { name, mensaje },             
    'TgAyhcGi-BA2UFJXB'               
  )
}
