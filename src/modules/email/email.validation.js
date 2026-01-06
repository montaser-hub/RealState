import Joi from 'joi';

export const sendCustomEmailSchema = Joi.object({
  to: Joi.alternatives()
    .try(
      Joi.string().email(),
      Joi.array().items(Joi.string().email())
    )
    .required(),
  subject: Joi.string().required().max(200),
  html: Joi.string().required(),
  text: Joi.string().optional(),
});

export const sendCustomEmailByIdentifierSchema = Joi.object({
  subject: Joi.string().required().max(200),
  html: Joi.string().required(),
  text: Joi.string().optional(),
});




