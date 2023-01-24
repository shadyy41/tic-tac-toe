class express_error extends Error{
  constructor(message, status){
    super()
    this.message = message
    this.status = status
  }
}

export { express_error }