import Joi from '../../utils/joiExtention.js';

const passwordRegex = new RegExp( /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,20})$/ );
const passMessage = 'Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character, and be 8–20 characters long.';

export const loginUserSchema = Joi.object( {
  email: Joi.string()
    .email()
    .optional(),
  nickname: Joi.string()
    .optional(),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required.'
    }),
}).or('email', 'nickname') // Must provide either email or nickname

export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'any.required': 'Email is required.',
      'string.email': 'Invalid email format.'
    }),
});

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({ 'any.required': 'Current password is required.' }),
  newPassword: Joi.string()
    .min(8)
    .max(20)
    .required()
    .pattern(passwordRegex)
    .messages({
    'string.pattern.base': `${passMessage}`,
    'string.empty': 'Password cannot be empty'
    } ),
  confirmPassword: Joi.string()
  .valid(Joi.ref('newPassword'))
  .required()
  .messages({
    'any.required': 'Confirm password is required.',
    'string.empty': 'Confirm password cannot be empty.',
    'any.only': 'Passwords do not match.'
  })
});

export const createUserSchema = Joi.object( {
  nickname: Joi.string()
    .min(3)
    .max(10)
    .optional()
    .allow( '', null )
    .messages({
      'string.min': 'Nickname must be at least 3 characters.',
      'string.max': 'Nickname cannot exceed 10 characters.'
    }),
  firstName: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages({
      'any.required': 'First name is required.',
      'string.empty': 'First name cannot be empty.',
      'string.min': 'First name must be at least 3 characters.',
      'string.max': 'First name cannot exceed 20 characters.'
    }),
  lastName: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages({
      'any.required': 'Last name is required.',
      'string.empty': 'Last name cannot be empty.',
      'string.min': 'Last name must be at least 3 characters.',
      'string.max': 'Last name cannot exceed 30 characters.'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'any.required': 'Email is required.',
      'string.empty': 'Email cannot be empty.',
      'string.email': 'Invalid email format.'
    }),
  contactNumber: Joi.string()
    .optional()
    .allow( '', null ),
  AlternativePhone: Joi.string()
    .optional()
    .allow( '', null ),
  password: Joi.string().optional().allow( '', null ),
  role: Joi.string()
  .valid('admin', 'manager', 'guest', 'agent', 'broker')
  .required()
  .messages({
    'any.required': 'Role is required.',
    'string.empty': 'Role cannot be empty.',
    'any.only': 'Invalid role.'
  }),
  photo: Joi.string().optional(),
});

export const updateUserSchema = Joi.object( {
  nickname: Joi.string()
    .min(3)
    .max(10)
    .optional()
    .allow( '', null )
    .messages({
      'string.min': 'Nickname must be at least 3 characters.',
      'string.max': 'Nickname cannot exceed 10 characters.'
    }),
  firstName: Joi.string()
    .min(3)
    .max(20)
    .optional()
    .messages({
      'string.min': 'First name must be at least 3 characters.',
      'string.max': 'First name cannot exceed 20 characters.'
    }),
  lastName: Joi.string()
    .min( 3 )
    .max( 20 )
    .optional()
    .messages({
      'string.min': 'Last name must be at least 3 characters.',
      'string.max': 'Last name cannot exceed 30 characters.'
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Invalid email format.'
    } ),
  contactNumber: Joi.string()
    .optional()
    .allow( '', null ),
  AlternativePhone: Joi.string()
    .optional()
    .allow( '', null ),
  role: Joi.string()
  .valid('admin', 'manager', 'guest', 'agent', 'broker')
  .optional()
  .messages({
    'any.only': 'Invalid role.'
  }),
  photo: Joi.string().optional(),
});

export const updateMyProfileSchema = Joi.object( {
  nickname: Joi.string()
    .min(3)
    .max(10)
    .optional()
    .allow( '', null )
    .messages({
      'string.min': 'Nickname must be at least 3 characters.',
      'string.max': 'Nickname cannot exceed 10 characters.'
    }),
  firstName: Joi.string()
    .min(3)
    .max(20)
    .optional()
    .messages({
      'string.min': 'First name must be at least 3 characters.',
      'string.max': 'First name cannot exceed 20 characters.'
    }),
  lastName: Joi.string()
    .min(3)
    .max(20)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 3 characters.',
      'string.max': 'Last name cannot exceed 30 characters.'
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Invalid email format.'
    } ),
  contactNumber: Joi.string()
    .optional()
    .allow( '', null ),
  AlternativePhone: Joi.string()
    .optional()
    .allow( '', null ),
  photo: Joi.string().optional(),
});
