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
                  {"On a beautiful Saturday afternoon (specifically February 18th, 2023 at Virginia Tech), Jackson picked up Audrey from a local coffee shop that she worked at. Which is a story for another time\u2026."}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {"They took a walk around Hahn Horticulture Garden on campus and sat at a bench by a small pond. The sun was in Audrey\u2019s eyes but that\u2019s okay because Jackson put his arm around her for a moment so she knew he liked her. They then walked around Duck Pond on campus. While walking, Jackson was about an arms length away from Audrey so she then thought he didn\u2019t like her."}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {"They ended up back at the coffee shop to have yet another coffee and sit and play chess. Jackson complimented Audrey saying he liked the view but then when it was time to say bye, Jackson gave Audrey a side hug. And the rest is history\u2026."}
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card border-border">
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-medium text-foreground">The Proposal</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {"Audrey thought \u201Cis it happening? is it not happening? he went to the dry cleaners, he got a haircut, he said to get her nails done.\u201D Her anxiety was high not knowing. They went to DC (which actually was a horrible uber ride and they were almost late to dinner but Audrey had never seen Jackson so calm). They had dinner at the top of The Kennedy Center. Audrey of course did not eat her whole meal. She had anxiety (a good kind. don\u2019t worry)."}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {"Audrey went to the bathroom and texted her friends to update them. They then walked up to the Lincoln Memorial and took some pictures\u2026 which never happens but Jackson was secretly texting the photographer. The Lincoln Memorial was too crowded so they walked down to the reflection pool and everyone faded away. They were holding hands. Jackson kept saying \u201CWe are going to spend the rest of our lives here.\u201D Audrey said \u201Chey look a port-a-potty.\u201D and Jackson was down on one knee."}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {"Audrey was sure she couldn\u2019t see a ring box in his jacket so she was surprised. A good kind of surprised."}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {"This was the start of a new life together for Audrey and Jackson!"}
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
