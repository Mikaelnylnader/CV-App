import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { stripeService } from '../services/stripeService';

export default function Pricing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: 'Free',
      priceId: null,
      price: {
        monthly: '0',
        yearly: '0',
        lifetime: null
      },
      features: [
        '3 Resume Customizations',
        'Basic AI Optimization',
        'PDF Export',
        'Email Support',
        'Standard Templates'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      priceId: {
        monthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY,
        yearly: import.meta.env.VITE_STRIPE_PRICE_PRO_YEARLY
      },
      price: {
        monthly: '19.99',
        yearly: '199.99',
        lifetime: null
      },
      features: [
        'Unlimited Resume Customizations',
        'Advanced AI Optimization',
        'All Export Formats',
        'Priority Support',
        'Premium Templates',
        'LinkedIn Integration',
        'Cover Letter Generator',
        'Job Matching'
      ],
      cta: 'Start Pro',
      popular: true
    },
    {
      name: 'Lifetime',
      priceId: import.meta.env.VITE_STRIPE_PRICE_LIFETIME,
      price: {
        monthly: null,
        yearly: null,
        lifetime: '499.99'
      },
      features: [
        'Everything in Pro plan',
        'Lifetime Access',
        'Future Updates',
        'VIP Support',
        'Custom Branding',
        'API Access',
        'Personal Success Manager',
        'Resume Analytics'
      ],
      cta: 'Get Lifetime Access',
      popular: false
    }
  ];

  const handleGetStarted = async (plan) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    if (plan.name === 'Free') {
      navigate('/dashboard');
      return;
    }

    try {
      setLoading(true);
      const priceId = plan.priceId?.lifetime || 
                     (isYearly ? plan.priceId.yearly : plan.priceId.monthly);
                     
      await stripeService.createCheckoutSession(priceId, user.id);
    } catch (error) {
      console.error('Error starting checkout:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (plan) => {
    if (plan.price.lifetime) {
      return `$${plan.price.lifetime}`;
    }
    return isYearly ? `$${plan.price.yearly}/year` : `$${plan.price.monthly}/month`;
  };

  const getSavingsText = (plan) => {
    if (plan.price.lifetime) {
      return 'One-time payment';
    }
    if (isYearly && plan.price.yearly !== '0') {
      const monthlyCost = parseFloat(plan.price.monthly);
      const yearlyCost = parseFloat(plan.price.yearly);
      const savings = ((monthlyCost * 12) - yearlyCost).toFixed(2);
      return `Save $${savings}/year`;
    }
    return null;
  };

  return (
    <div id="pricing" className="bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-400 mb-8">No hidden fees. Cancel anytime.</p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`text-sm ${isYearly ? 'text-gray-400' : 'text-white'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 mx-3 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-600"
            >
              <span
                className={`${
                  isYearly ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative card p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                plan.popular ? 'border-2 border-blue-500 hover:border-blue-400' : 'hover:border-2 hover:border-gray-400'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold transition-colors duration-300 hover:text-blue-500">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold">{getPrice(plan)}</span>
                </div>
                {getSavingsText(plan) && (
                  <p className="mt-2 text-sm text-green-500 font-medium">
                    {getSavingsText(plan)}
                  </p>
                )}
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => handleGetStarted(plan)}
                disabled={loading}
                className={`w-full mt-8 transition-all duration-300 transform hover:scale-105 ${
                  plan.popular 
                    ? 'btn-primary' 
                    : plan.name === 'Lifetime'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700'
                      : 'bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <p className="text-gray-400">
            30-day money-back guarantee • Secure payment • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}