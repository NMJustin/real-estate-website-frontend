'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/services/api'

type FAQ = {
  id: string
  question: string
  answer: string
  category?: string
  displayOrder?: number
  isActive?: boolean
}

export default function FAQsContent() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    api.getFaqs()
      .then((response) => {
        const data = (response as { data: FAQ[] }).data || []
        if (data.length > 0) {
          setFaqs(data)
        } else {
          // Use suggested questions if no FAQs exist
          setFaqs([
            {
              id: '1',
              question: 'What types of properties do you offer?',
              answer: 'We offer a wide range of properties including residential homes, apartments, commercial offices, retail spaces, warehouses, and land. Our portfolio caters to buyers, renters, and investors with diverse needs and budgets.',
              category: 'General',
              displayOrder: 1,
              isActive: true
            },
            {
              id: '2',
              question: 'How can I search for a property?',
              answer: 'You can search for properties using our advanced search filters. Filter by property type, location, price range, number of bedrooms, bathrooms, and other specific requirements. You can also save your search criteria for future reference.',
              category: 'Search',
              displayOrder: 2,
              isActive: true
            },
            {
              id: '3',
              question: 'How can I request a property viewing?',
              answer: 'To request a property viewing, click the "Request Viewing" button on any property listing. Fill out the viewing request form with your contact details, preferred date and time, and number of visitors. Our team will confirm the appointment with you.',
              category: 'Viewings',
              displayOrder: 3,
              isActive: true
            },
            {
              id: '4',
              question: 'How can I list my property?',
              answer: 'To list your property, visit our "List Your Property" page and complete the property listing form. Provide details about your property including location, size, features, and upload images. Our team will review your submission before publication.',
              category: 'Listing',
              displayOrder: 4,
              isActive: true
            },
            {
              id: '5',
              question: 'How do I contact a property agent?',
              answer: 'You can contact a property agent directly through the property listing page using the "Contact Agent" form or by calling the provided phone number. Alternatively, you can submit a general inquiry through our contact page.',
              category: 'Contact',
              displayOrder: 5,
              isActive: true
            },
            {
              id: '6',
              question: 'Are all listed properties available?',
              answer: 'We strive to keep our property listings current, but availability can change quickly. We recommend contacting us directly to confirm the availability of any property you are interested in before making arrangements.',
              category: 'General',
              displayOrder: 6,
              isActive: true
            },
            {
              id: '7',
              question: 'How are property prices determined?',
              answer: 'Property prices are determined by various factors including location, property size, condition, market demand, and comparable sales in the area. We provide professional property valuation services to help determine fair market value.',
              category: 'Pricing',
              displayOrder: 7,
              isActive: true
            },
            {
              id: '8',
              question: 'Do you provide property management services?',
              answer: 'Yes, we offer property management services for property owners. Our services include tenant coordination, property maintenance, rent administration, property inspections, and reporting. Contact us to learn more about our property management offerings.',
              category: 'Services',
              displayOrder: 8,
              isActive: true
            },
            {
              id: '9',
              question: 'Do you assist with property valuation?',
              answer: 'Yes, we provide property valuation services. You can request a valuation through our website by filling out the property valuation request form. Our professionals will conduct a thorough assessment and provide you with a detailed valuation report.',
              category: 'Services',
              displayOrder: 9,
              isActive: true
            },
            {
              id: '10',
              question: 'What information is required to list a property?',
              answer: 'To list a property, you will need to provide: owner name, contact information (phone and email), property type, location, transaction type (sale/rent/lease), expected price, property size, number of bedrooms and bathrooms, property description, and images if available.',
              category: 'Listing',
              displayOrder: 10,
              isActive: true
            },
            {
              id: '11',
              question: 'Can I save properties for later?',
              answer: 'Yes, you can save properties to your favorites list for easy access later. Simply click the heart icon on any property listing to add it to your saved properties. You can view your saved properties through your account dashboard.',
              category: 'Account',
              displayOrder: 11,
              isActive: true
            },
            {
              id: '12',
              question: 'Where are your offices located?',
              answer: 'Our main office is located in Kigali, Rwanda. We have satellite offices in major districts to better serve our clients across the country. Contact us for specific office locations and operating hours.',
              category: 'Contact',
              displayOrder: 12,
              isActive: true
            },
            {
              id: '13',
              question: 'How can I contact the company?',
              answer: 'You can contact us through our website contact form, by phone, or by visiting our offices. Our contact information is available on the Contact page. We typically respond to inquiries within 24-48 hours.',
              category: 'Contact',
              displayOrder: 13,
              isActive: true
            }
          ])
        }
      })
      .catch((err) => {
        setError('Unable to load FAQs.')
        console.error(err)
      })
      .finally(() => setLoading(false))
  }, [])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (loading) {
    return (
      <main className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions about our real estate services, property listings, and processes.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800 text-sm text-center">
            <strong>Note:</strong> FAQ content shall be reviewed and approved by the company.
          </p>
        </div>

        <div className="space-y-4">
          {faqs
            .filter(faq => faq.isActive !== false)
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
            .map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-slate-600 flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                    {faq.category && (
                      <span className="inline-block mt-3 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        {faq.category}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>

        {faqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No FAQs available at this time.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Can't find the answer you're looking for?</p>
          <Link
            href="/contact"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  )
}
