import swaggerUi from "swagger-ui-express";
import type { Application } from "express";
import { env } from "./config/env.js";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Listing Onboarding API",
    version: "1.0.0",
    description: "Swagger documentation for the listing onboarding endpoints.",
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Listing Onboarding",
      description: "Listing creation and status update APIs",
    },
  ],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ListingPayload: {
        type: "object",
        required: ["listing_type", "current_step", "listing_id"],
        properties: {
          listing_type: {
            type: "string",
            example: "home",
          },
          current_step: {
            type: "string",
            example: "essential",
          },
          listing_id: {
            type: "string",
            example: "ABC1234567",
          },
          listing_details: {
            type: "object",
            additionalProperties: true,
            example: {
              listing_name: "Sunset Villa",
              listing_status: "work_in_progress",
            },
          },
          commercial_details: {
            type: "object",
            additionalProperties: true,
          },
          property_details: {
            type: "object",
            additionalProperties: true,
          },
          broker_and_agent: {
            type: "object",
            additionalProperties: true,
          },
        },
      },
      ListingStatusUpdate: {
        type: "object",
        required: ["action"],
        properties: {
          action: {
            type: "string",
            enum: ["approved", "pending", "rejected", "delisted"],
            example: "approved",
          },
        },
      },
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Authentication Failed!" },
        },
      },
    },
  },
  paths: {
    "/v1/listing/onboarding": {
      post: {
        tags: ["Listing Onboarding"],
        summary: "Create or update a listing onboarding record",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ListingPayload",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Listing updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Listing updated successfully." },
                    data: { type: "object", additionalProperties: true },
                  },
                },
              },
            },
          },
          201: {
            description: "Listing created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Listing created successfully." },
                    data: { type: "object", additionalProperties: true },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/v1/listing/onboarding/{id}": {
      get: {
        tags: ["Listing Onboarding"],
        summary: "Fetch a listing by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", example: "64d0f5d8c9d3de72ab123456" },
            description: "MongoDB ObjectId of the listing",
          },
        ],
        responses: {
          200: {
            description: "Listing record fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "object", additionalProperties: true },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Listing Onboarding"],
        summary: "Update listing status",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", example: "64d0f5d8c9d3de72ab123456" },
            description: "MongoDB ObjectId of the listing",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ListingStatusUpdate",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Listing status updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Listing status updated successfully." },
                    data: { type: "object", additionalProperties: true },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
  },
} as const;

export const setupSwagger = (app: Application): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "Listing Onboarding API Docs",
  }));
};
