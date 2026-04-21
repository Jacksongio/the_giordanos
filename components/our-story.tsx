import { Card } from "@/components/ui/card"

export function OurStory() {
  return (
    <section id="story" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-foreground mb-4 text-balance">
            Our Love Story
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Every love story is beautiful, but ours is the best.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Card className="p-8 bg-card border-border">
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-medium text-foreground">The First Date</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {"On a beautiful Saturday afternoon, February 18th, 2023, Jackson picked up Audrey from the coffee shop she worked at on the Virginia Tech campus."}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {"They walked through Hahn Horticulture Garden and sat by a small pond, then made their way around Duck Pond. At one point Jackson was an arm\u2019s length away, so naturally Audrey assumed the worst. They ended the afternoon back at the coffee shop over another cup and a game of chess, where Jackson mentioned he liked the view. And the rest is history."}
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card border-border">
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-medium text-foreground">The Proposal</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {"Audrey had her suspicions (the dry cleaners, the haircut, the nudge to get her nails done), but her anxiety was high not knowing for sure. They had dinner at the top of The Kennedy Center in DC, where Audrey predictably could not finish her meal."}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {"Afterward, they walked to the Lincoln Memorial and took pictures, which never happens. Jackson was secretly coordinating with a photographer. They made their way down to the reflection pool, and Jackson got down on one knee. Audrey was genuinely surprised. This was the start of a new life together."}
                </p>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src="/jackson-audrey-engagement-dc.jpeg"
                alt="Jackson and Audrey engagement photo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
