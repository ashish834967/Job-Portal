
import { User, User } from "../models/user.model";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";

//Register controller
export const Register = async (req, res) => {
    
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success:false
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "User already exixst with this email",
                success:false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile
        })

        return res.status(201).json({
            message: "Account ctreated successfully",
            success:true
        })

    } catch (error) {
        console.log(error)
    }
}   

//Login controller

export const Login = async (req, res) => {
    
    try {
        const { email, password , role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success:false
            })
        }
        let user = await User.findOne({ email })
        if (!email) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success:false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password",
                success: false
            })
        }
        if (role != user.role) {
            return res.status(400).json({
                message: "Account doesnot exist with current role",
                success:false
            })
        }
        const tokenData = {
            userId : user._id
        }

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile:user.profile
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' })
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

//Logout controller

export const Logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success:true,
        })
    } catch (error) {
        console.log(error)
    }
}

//update profile controller

export const ProfileUpdate = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

         if (!fullname || !email || !phoneNumber || !bio || !skills) {
            return res.status(400).json({
                message: "Something is missing",
                success:false
            })
        }

        const skillArray = skills.split(",")
        const userId = req._id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User does not found",
                success:false
            })
        }

        // updating data
        user.fullname = fullname;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.profile.bio = bio;
        user.profile.skills = skillArray;

        await user.save(); 

         user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile:user.profile
        }

        return res.status(200).json({
            message: "Profile update successfully",
            user,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}