import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { CloudRain, Calendar, TrendingUp, Shield } from "lucide-react";
import weatherHero from "@/assets/weather-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <img
          src={weatherHero}
          alt="Dramatic weather"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="max-w-4xl text-center space-y-6 animate-fade-in">
            <CloudRain className="h-20 w-20 text-primary mx-auto mb-6" />
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              WeatherPredict
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Plan your events with confidence. Get accurate weather predictions powered by machine learning.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="text-lg px-8"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="text-lg px-8 backdrop-blur-md bg-card/50 border-white/10"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose WeatherPredict?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <GlassCard className="text-center hover-scale">
            <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Event Planning</h3>
            <p className="text-muted-foreground">
              Create and manage your events with ease. Get weather insights for each occasion.
            </p>
          </GlassCard>

          <GlassCard className="text-center hover-scale">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">AI Predictions</h3>
            <p className="text-muted-foreground">
              Advanced machine learning models analyze weather patterns to give you accurate forecasts.
            </p>
          </GlassCard>

          <GlassCard className="text-center hover-scale">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Smart Recommendations</h3>
            <p className="text-muted-foreground">
              Receive actionable insights and recommendations to make informed decisions about your events.
            </p>
          </GlassCard>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <GlassCard className="text-center max-w-3xl mx-auto py-12">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join WeatherPredict today and never let weather surprise your events again.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-12">
            Create Free Account
          </Button>
        </GlassCard>
      </div>
    </div>
  );
};

export default Index;
