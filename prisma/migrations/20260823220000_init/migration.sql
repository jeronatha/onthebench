-- CreateTable
CREATE TABLE "listing" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "one_line" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "link_key" TEXT NOT NULL,
    "icon_url" TEXT,
    "contact_email" TEXT NOT NULL,
    "category_slug" TEXT NOT NULL,
    "available_from" DATE NOT NULL,
    "capacity" TEXT NOT NULL,
    "last_value" DECIMAL(12,2) NOT NULL,
    "last_paid_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "stripe_id" TEXT NOT NULL,
    "value_before" DECIMAL(12,2) NOT NULL,
    "value_after" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "listing_handle_key" ON "listing"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "listing_link_key_key" ON "listing"("link_key");

-- CreateIndex
CREATE INDEX "listing_category_slug_idx" ON "listing"("category_slug");

-- CreateIndex
CREATE INDEX "listing_last_paid_at_idx" ON "listing"("last_paid_at");

-- CreateIndex
CREATE UNIQUE INDEX "payment_stripe_id_key" ON "payment"("stripe_id");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
