import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function seats() {
  const rows = ["A","B","C","D","E"];
  const out: {seatNo:string}[] = [];
  for (const r of rows) for (let n=1;n<=10;n++) out.push({seatNo:`${r}${n}`});
  return out;
}

async function main() {
  await prisma.seat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.show.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.screen.deleteMany();
  await prisma.user.deleteMany();

  const screen1 = await prisma.screen.create({data:{name:"Screen 1", capacity:50}});
  const screen2 = await prisma.screen.create({data:{name:"Screen 2", capacity:50}});

  const movies = await Promise.all([
    prisma.movie.create({
      data:{
        title:"Chennai Nights",
        description:"A fictional Tamil drama used for the internal booking application.",
        posterUrl:"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
        durationMin:142, language:"Tamil", certificate:"U/A"
      }
    }),
    prisma.movie.create({
      data:{
        title:"The Last Metro",
        description:"A fictional English thriller used for the internal booking application.",
        posterUrl:"https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
        durationMin:128, language:"English", certificate:"U/A"
      }
    })
  ]);

  const now = new Date();
  const times = [11,14,17,20];
  for (const movie of movies) {
    for (const screen of [screen1, screen2]) {
      for (const hour of times) {
        const startsAt = new Date(now);
        startsAt.setHours(hour,0,0,0);
        if (startsAt <= now) startsAt.setDate(startsAt.getDate()+1);
        const show = await prisma.show.create({
          data:{movieId:movie.id, screenId:screen.id, startsAt, price:220}
        });
        await prisma.seat.createMany({data:seats().map(s=>({showId:show.id, seatNo:s.seatNo}))});
      }
    }
  }
  console.log("Seeded 2 movies, 2 screens, 8 shows per day.");
}
main().finally(()=>prisma.$disconnect());