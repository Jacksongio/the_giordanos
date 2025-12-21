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
                <h3 className="font-serif text-2xl font-medium text-foreground">Our First Date</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {
                    'It was a sunny day, Jackson picked up Audrey from her job at the time "Halwa" a nice coffee shop in Blacksburg, VA. First we went to Hahn Horticulture Garden at Virginia Tech and walked around with our coffees just getting to know eachother. Then Jackson drove us to Duck Pond (an iconic pond with walking paths in Blacksburg, VA) we walked around and just got to know eachother. Afterwards we came back to Halwa where the two of them sad and had yet ANOTHER coffee, and the rest is history.'
                  }
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card border-border">
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-medium text-foreground">The Proposal</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {
                    "On a crisp, enchanting September evening, Jackson planned an intimate dinner for two at the Kennedy Center’s elegant Roof Terrace Restaurant, offering breathtaking views of the Potomac River and Washington, D.C.’s iconic skyline. Afterward, they strolled toward the Lincoln Memorial, where Jackson had envisioned proposing against the stunning backdrop of the Washington Monument and Reflecting Pool. However, the crowd was larger than expected. Thinking quickly, Jackson guided Audrey and the photographer to a quieter spot along the Reflecting Pool, where the surrounding bustle faded away. There, by the serene, empty pool, Jackson proposed, creating a perfect moment under the starlit sky."
                  }
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
