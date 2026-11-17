export default function Story() {
  return (
    <section id="story" className="scroll-mt-28 bg-ink text-paper py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-16 items-end">
          <h2 className="font-display font-bold text-3xl sm:text-4xl leading-snug">
            اتعمل في مصر،
            <br />
            <span className="text-sand">لشوارع مصر.</span>
          </h2>
          <div className="text-paper/70 leading-loose space-y-4">
            <p>
              بدأنا شقو في ٢٠٢٤ علشان كنا عايزين كوتشي شكله حلو ويستحمل المشي الكتير من غير ما
              نصرف عليه مرتب شهر. الموديل الأول اسمه «جناح»، والجناح اللي على الجنب ده هو حكايتنا:
              خفة في المشي.
            </p>
            <p>بنعمل كميات صغيرة، وبنتابع كل جوز بنفسنا قبل ما يخرج.</p>
          </div>
        </div>

        <figure className="mt-12">
          <img
            src="/cover.jpg"
            alt="جوز كوتشي شقو في شارع بالقاهرة وقت الغروب"
            className="w-full aspect-[16/9] md:aspect-[2752/1536] object-cover object-right rounded-2xl"
            loading="lazy"
          />
          <figcaption className="mt-3 text-xs text-paper/40">وسط البلد، القاهرة</figcaption>
        </figure>
      </div>
    </section>
  )
}
