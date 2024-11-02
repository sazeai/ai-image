import type { Metadata } from 'next'
import ImageGenerator from '@/components/ImageGenerator'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { CheckCircle, TrendingUp, Users, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Influencer Generator | Create Stunning Influencer Content with AI',
  description: 'Generate unique and engaging influencer content using our advanced AI Influencer Generator. Transform your social media presence and boost your influence instantly.',
  keywords: 'AI, influencer generator, artificial intelligence, social media, content creation, digital marketing',
  openGraph: {
    title: 'AI Influencer Generator | Create Stunning Influencer Content with AI',
    description: 'Generate unique and engaging influencer content using our advanced AI Influencer Generator. Transform your social media presence and boost your influence instantly.',
    images: [
      {
        url: 'https://example.com/og-image-influencer.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Influencer Generator Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Influencer Generator | Create Stunning Influencer Content with AI',
    description: 'Generate unique and engaging influencer content using our advanced AI Influencer Generator. Transform your social media presence and boost your influence instantly.',
    images: ['https://example.com/twitter-image-influencer.jpg'],
  },
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div>
        <ImageGenerator />
      </div>

      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Transform Your Social Media Presence</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-4">
                The AI Influencer Generator is your secret weapon for creating captivating content that resonates with your audience. Whether you're an aspiring influencer or a seasoned pro, our tool will help you:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center"><CheckCircle className="mr-2 text-primary" /> Generate eye-catching visuals</li>
                <li className="flex items-center"><CheckCircle className="mr-2 text-primary" /> Craft engaging captions</li>
                <li className="flex items-center"><CheckCircle className="mr-2 text-primary" /> Discover trending topics</li>
                <li className="flex items-center"><CheckCircle className="mr-2 text-primary" /> Optimize your content for maximum reach</li>
              </ul>
            </div>
         
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Why Choose AI Influencer Generator?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-md">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-4">Stay Ahead of Trends</h3>
              <p className="text-muted-foreground">Our AI analyzes current trends and helps you create content that's always relevant and engaging to your audience.</p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-md">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-4">Boost Productivity</h3>
              <p className="text-muted-foreground">Generate multiple content ideas in seconds, allowing you to focus on what matters most - engaging with your followers.</p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-md">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-4">Grow Your Audience</h3>
              <p className="text-muted-foreground">Create content that resonates with your target audience and attracts new followers, expanding your influence.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Enter Your Prompt</h3>
              <p className="text-muted-foreground">Describe the content you want to create or the message you want to convey.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Choose Your Style</h3>
              <p className="text-muted-foreground">Select from various styles to match your brand and aesthetic preferences.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Generate Content</h3>
              <p className="text-muted-foreground">Our AI creates unique, high-quality visuals and captions based on your input.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">4</div>
              <h3 className="font-semibold mb-2">Customize and Share</h3>
              <p className="text-muted-foreground">Fine-tune the generated content and share it directly to your social media platforms.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Revolutionize Your Content?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of influencers who are already using our AI Influencer Generator to create captivating content and grow their following. 
            Whether you're just starting out or looking to take your influence to the next level, our tool is perfect for you.
          </p>
          <Button asChild size="lg">
            <Link href="#generator">Start Creating Now</Link>
          </Button>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Is the AI Influencer Generator suitable for all social media platforms?</h3>
              <p className="text-muted-foreground">Yes, our tool can generate content optimized for various platforms, including Instagram, TikTok, YouTube, and more.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How does the AI ensure my content is unique?</h3>
              <p className="text-muted-foreground">Our AI uses advanced algorithms to create original content based on your input, ensuring that each piece is tailored to your brand and audience.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I use the generated content for commercial purposes?</h3>
              <p className="text-muted-foreground">Yes, all content created with our AI Influencer Generator is royalty-free and can be used for both personal and commercial purposes.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How often is the AI updated with new trends?</h3>
              <p className="text-muted-foreground">Our AI is continuously learning and updating its knowledge base to stay current with the latest trends and best practices in influencer marketing.</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}