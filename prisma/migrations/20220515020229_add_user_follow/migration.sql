-- CreateTable
CREATE TABLE "_UserFollow" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserFollowRequest" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFollow_AB_unique" ON "_UserFollow"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFollow_B_index" ON "_UserFollow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFollowRequest_AB_unique" ON "_UserFollowRequest"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFollowRequest_B_index" ON "_UserFollowRequest"("B");

-- AddForeignKey
ALTER TABLE "_UserFollow" ADD CONSTRAINT "_UserFollow_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollow" ADD CONSTRAINT "_UserFollow_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollowRequest" ADD CONSTRAINT "_UserFollowRequest_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollowRequest" ADD CONSTRAINT "_UserFollowRequest_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
