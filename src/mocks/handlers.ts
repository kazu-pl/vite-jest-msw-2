// src/mocks/handlers.js
import { http, HttpResponse } from "msw";
import { CharactersResponse } from "../types/api.types";

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get("https://example.com/user", () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
      firstName: "John",
      lastName: "Maverick",
    });
  }),
  http.get("http://localhost:4000/characters", () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      totalItems: 1,
      data: [
        {
          __v: 0,
          _id: "0000-1111",
          createdAt: "1692794096000",
          description: "Some description",
          imagesList: [],
          title: "Some title",
          updatedAt: "1692794096321",
        },
      ],
    } as CharactersResponse);
  }),
];
