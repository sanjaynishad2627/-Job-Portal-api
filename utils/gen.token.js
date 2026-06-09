import jwt from 'jsonwebtoken'

export const gentoken = async(id)=>{
 return await jwt.sign({id},process.env.SECRET_CODE,
    {
        expiresIn:"1d"
    }
 )
}