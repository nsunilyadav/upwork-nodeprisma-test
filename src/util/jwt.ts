import jwt from 'jsonwebtoken'

export const generateToken = (user : any) => {
    return jwt.sign({
        data: user
    }, 'secretOrPrivateKey', {
        expiresIn: '10h'
    },)
}
