"use client"

import { useState } from "react"
import { ExternalLink, Mail, MessageCircle, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const FORMSPREE_URL = "https://formspree.io/f/mzzvedpn"
const EBAY_STORE_URL = "https://www.ebay.com/str/tnt4sportscards"
const WHATNOT_URL = "https://www.whatnot.com/user/pokepitchshop"
const TWITTER_URL = "https://x.com/pokepitchshop"
const EMAIL = "tom@pokepitchshop.com"

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _replyto: formData.email,
        }),
      })

      if (response.ok) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        })
        alert("Message sent successfully! We'll get back to you soon.")
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert(
        `Failed to send message. Please try again or email us at ${EMAIL}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Send Us a Message</CardTitle>
          <CardDescription className="text-slate-300">
            We&apos;ll get back to you within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-white">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="border-slate-600 bg-slate-700 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border-slate-600 bg-slate-700 text-white"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border-slate-600 bg-slate-700 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="subject" className="text-white">
                Subject
              </Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="border-slate-600 bg-slate-700 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-white">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="border-slate-600 bg-slate-700 text-white"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-500 font-semibold text-slate-900 hover:bg-yellow-600 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <div>
          <h3 className="mb-6 text-2xl font-bold text-white">
            Other Ways to Reach Us
          </h3>
          <div className="space-y-6">
            <a
              href={EBAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 rounded-lg transition-colors hover:bg-yellow-500/10"
            >
              <div className="rounded-lg bg-yellow-500/20 p-3">
                <ExternalLink className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">eBay Store</h4>
                <span className="text-slate-300">
                  Visit our eBay store for current listings and auctions
                </span>
              </div>
            </a>

            <div className="flex items-center space-x-4">
              <div className="rounded-lg bg-yellow-500/20 p-3">
                <Mail className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Email</h4>
                <p className="text-slate-300">{EMAIL}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="rounded-lg bg-yellow-500/20 p-3">
                <MessageCircle className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Response Time</h4>
                <p className="text-slate-300">
                  We typically respond within 24 hours
                </p>
              </div>
            </div>

            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 rounded-lg transition-colors hover:bg-yellow-500/10"
            >
              <div className="rounded-lg bg-yellow-500/20 p-3">
                <Twitter className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Twitter/X</h4>
                <p className="text-slate-300">
                  Follow us for updates and new arrivals
                </p>
              </div>
            </a>

            <a
              href={WHATNOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 rounded-lg transition-colors hover:bg-yellow-500/10"
            >
              <div className="rounded-lg bg-yellow-500/20 p-3">
                <ExternalLink className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Whatnot</h4>
                <span className="text-slate-300 underline hover:text-yellow-400">
                  Shop our live auctions & breaks
                </span>
              </div>
            </a>
          </div>
        </div>

        <Card className="border-slate-700 bg-slate-800">
          <CardContent className="pt-6">
            <h4 className="mb-4 font-semibold text-white">Business Hours</h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
