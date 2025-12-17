import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function Registry() {
  const registries = [
    {
      name: "Crate & Barrel",
      description: "Modern furniture and decor for our first home",
      url: "#",
      image: "/modern-home-furniture-and-decor.jpg",
    },
  ]

  return (
        <div className="grid md:grid-cols-3 gap-8">
          {registries.map((registry, index) => (
            <Card key={index} className="overflow-hidden bg-card border-border group hover:shadow-lg transition-shadow">
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={registry.image || "/placeholder.svg"}
                  alt={registry.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="font-serif text-xl font-medium text-foreground">{registry.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{registry.description}</p>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                  asChild
                >
                  <a href={registry.url} target="_blank" rel="noopener noreferrer">
                    View Registry
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
