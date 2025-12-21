const Joi = require("joi");

// joi schema validation for story
module.exports.storySchemaJoi = Joi.object({
  story: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    genre: Joi.string().required(),
    tags: Joi.string().required(),
    summary:Joi.string().required(),
    img: Joi.any()
  }).required()
});

// joi schema validation for review
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
    }).required()
});
