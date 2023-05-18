CREATE TABLE "favorites"(
	"id" SERIAL PRIMARY KEY,
	"title" VARCHAR(64),
	"releaseDate" DATE
);

CREATE TABLE "characters"(
	"id" SERIAL PRIMARY KEY,
	"link" VARCHAR(64)
);

CREATE TABLE "characters_favorites"(
	"favorites_id" INTEGER,
	"characters_id" INTEGER,
	FOREIGN KEY ("favorites_id") REFERENCES "favorites"("id"),
	FOREIGN KEY ("characters_id") REFERENCES "characters"("id")
);