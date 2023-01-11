export interface Cliente{
  cli_id: number,
  cli_empresa_id: number,
  cli_nacionalidad: string,
  cli_documento_identidad: string,
  cli_tipo_documento_identidad: string,
  cli_nombres_natural: string,
  cli_razon_social: string,
  cli_observacion: string,
  cli_fecha_nacimiento: string,
  cli_teleono: string,
  cli_celular: string,
  cli_email: string,
  cli_direccion: string,
  cli_profesion: string,
  cli_message_error?: string,
  cli_error_server?: boolean
}
