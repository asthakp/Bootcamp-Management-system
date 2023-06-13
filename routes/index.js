import express from 'express'
const router=express.Router()

router.get('/',(req,res)=>{
    res.send('bootcamp')
})

export default router