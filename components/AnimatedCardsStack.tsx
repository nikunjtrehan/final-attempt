"use client" 

import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion"

import { cn } from "../lib/utils"

const cardVariants = cva("absolute will-change-transform", {
  variants: {
    variant: {
      dark: "flex size-full flex-col items-center justify-center gap-6 rounded-2xl border border-white/10 bg-zinc-900/90 p-8 backdrop-blur-md shadow-2xl",
      light: "flex size-full flex-col items-center justify-center gap-6 rounded-2xl border bg-background/80 p-6 backdrop-blur-md",
    },
  },
  defaultVariants: {
    variant: "dark",
  },
})

interface ReviewProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number
  maxRating?: number
}

interface CardStickyProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof cardVariants> {
  arrayLength: number
  index: number
  incrementY?: number
  incrementZ?: number
  incrementRotation?: number
}

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined)

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (context === undefined) {
    throw new Error("useContainerScrollContext must be used within a ContainerScrollContextProvider")
  }
  return context
}

export const ContainerScroll: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, style, className, ...props }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end end"],
  })

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-[200vh] w-full scrollbar-hide", className)}
        style={{ perspective: "1000px", ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}

ContainerScroll.displayName = "ContainerScroll"

export const CardsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ perspective: "1000px", ...props.style }}
      {...props}
    >
      {children}
    </div>
  )
}

CardsContainer.displayName = "CardsContainer"

export const CardTransformed = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      arrayLength,
      index,
      incrementY = 15,
      incrementZ = 15,
      incrementRotation = -index + 90,
      className,
      variant,
      style,
      ...props
    },
    ref
  ) => {
    const { scrollYProgress } = useContainerScrollContext()

    const start = index / (arrayLength + 1)
    const end = (index + 1) / (arrayLength + 1)
    const range = React.useMemo(() => [start, end], [start, end])
    const rotateRange = [range[0] - 1.5, range[1] / 1.5]

    const y = useTransform(scrollYProgress, range, ["0%", "-180%"])
    const rotate = useTransform(scrollYProgress, rotateRange, [
      incrementRotation,
      0,
    ])
    const transform = useMotionTemplate`translateZ(${
      index * incrementZ
    }px) translateY(${y}) rotate(${rotate}deg)`

    const cardStyle = {
      top: index * incrementY,
      transform,
      backfaceVisibility: "hidden" as const,
      zIndex: (arrayLength - index) * incrementZ,
      ...style,
    }
    
    return (
      <motion.div
        layout="position"
        ref={ref}
        style={cardStyle}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      />
    )
  }
)

CardTransformed.displayName = "CardTransformed"

export const ReviewStars = React.forwardRef<HTMLDivElement, ReviewProps>(
  ({ rating, maxRating = 5, className, ...props }, ref) => {
    const filledStars = Math.floor(rating)
    const fractionalPart = rating - filledStars
    const emptyStars = maxRating - filledStars - (fractionalPart > 0 ? 1 : 0)

    return (
      <div className={cn("flex items-center gap-1", className)} ref={ref} {...props}>
        <div className="flex items-center">
          {[...Array(filledStars)].map((_, index) => (
            <svg key={`filled-${index}`} className="size-5 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
          ))}
          {fractionalPart > 0 && (
            <svg className="size-5 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
              <defs>
                <linearGradient id="half">
                  <stop offset={`${fractionalPart * 100}%`} stopColor="currentColor" />
                  <stop offset={`${fractionalPart * 100}%`} stopColor="rgb(63 63 70)" />
                </linearGradient>
              </defs>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" fill="url(#half)" />
            </svg>
          )}
          {[...Array(emptyStars)].map((_, index) => (
            <svg key={`empty-${index}`} className="size-5 text-zinc-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
          ))}
        </div>
        <p className="sr-only">{rating}</p>
      </div>
    )
  }
)
ReviewStars.displayName = "ReviewStars"

const TESTIMONIALS = [
  {
    id: "testimonial-3",
    name: "James S.",
    profession: "Frontend Developer",
    rating: 5,
    description: "Their innovative solutions and quick turnaround time made our collaboration incredibly successful. Highly recommended!",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&auto=format&fit=crop",
  },
  {
    id: "testimonial-1",
    name: "Jessica H.",
    profession: "Enterprise Client",
    rating: 4.5,
    description: "The attention to detail and user experience in their work is exceptional. I'm thoroughly impressed with the final product.",
    avatarUrl: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=200&h=200&auto=format&fit=crop",
  },
  {
    id: "testimonial-2",
    name: "Lisa M.",
    profession: "Startup Founder",
    rating: 5,
    description: "Working with the ProConnect network was a game-changer for our project. Their expertise and professionalism exceeded our expectations.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&auto=format&fit=crop",
  },
  {
    id: "testimonial-4",
    name: "Jane D.",
    profession: "UI/UX Designer",
    rating: 4.5,
    description: "The quality of work and communication throughout the project was outstanding. They delivered exactly what we needed.",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&auto=format&fit=crop",
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative bg-[#050505] text-white py-24 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-center text-4xl sm:text-5xl font-bold tracking-tight">Testimonials</h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-slate-400">
            Hear directly from clients and experts who have transformed their workflows using the ProConnect platform.
          </p>
        </div>
        
        <ContainerScroll className="h-[250vh]">
          <div className="sticky left-0 top-[20vh] w-full py-12 flex justify-center">
            <CardsContainer className="w-full max-w-[450px] h-[500px]">
              {TESTIMONIALS.map((testimonial, index) => (
                <CardTransformed
                  arrayLength={TESTIMONIALS.length}
                  key={testimonial.id}
                  variant="dark"
                  index={index + 2}
                  role="article"
                >
                  <div className="flex flex-col items-center justify-center space-y-8 text-center h-full">
                    <ReviewStars rating={testimonial.rating} />
                    <div className="mx-auto text-xl font-medium leading-relaxed text-slate-200">
                      <blockquote>"{testimonial.description}"</blockquote>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-auto">
                      <img 
                        src={testimonial.avatarUrl} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full border border-zinc-700 object-cover"
                      />
                      <div className="text-left">
                        <span className="block text-lg font-bold tracking-tight text-white">
                          {testimonial.name}
                        </span>
                        <span className="block text-sm text-teal-400 font-medium">
                          {testimonial.profession}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardTransformed>
              ))}
            </CardsContainer>
          </div>
        </ContainerScroll>
      </div>
    </section>
  )
}
