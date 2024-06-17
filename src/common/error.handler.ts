import { BadRequestException, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common"

export const handleDBExceptions =(logger:Logger,error:any)=>{
    console.log(error)
    if(error.code ==="23505"){
      logger.error(error.detail)
      throw new BadRequestException(error.detail)
    }
    if(error.code ==="NOT_FOUND"){
      logger.error(error.detail)
      throw new NotFoundException(error.detail)
    }
    logger.error(error)
    throw new InternalServerErrorException("Unexpected error, check server logs")
  }