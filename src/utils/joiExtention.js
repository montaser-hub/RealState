import JoiBase from 'joi';

const objectIdExtension = (joi) => ({
  type: 'objectId',
  base: joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  messages: {
    'objectId.base': '{{#label}} must be a valid ObjectId',
  },
});

const Joi = JoiBase.extend(objectIdExtension);

export default Joi;
