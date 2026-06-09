import jwt from 'jsonwebtoken'

export const isAuthenticated =async(req,res,next)=>{
try {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message:"User not authenticated"
        })
    }
    const decoded = await jwt.verify(token,process.env.SECRET_CODE)
    if (!decoded) {
         return res.status(401).json({
            message:"Invalid Token",
            success:false
         })
    }

    req.id = decoded.id; 
    next()
} catch (error) {
    console.log(error.message)
}
}