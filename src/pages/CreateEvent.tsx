import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/GlassCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar } from "lucide-react";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .insert({
          user_id: user.id,
          title,
          description,
          event_date: eventDate,
          location,
        })
        .select()
        .single();

      if (eventError) throw eventError;

      // Create mock weather prediction
      const { error: predictionError } = await supabase
        .from("weather_predictions")
        .insert({
          event_id: eventData.id,
          temperature_celsius: Math.round(Math.random() * 20 + 10),
          conditions: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][
            Math.floor(Math.random() * 4)
          ],
          humidity_percent: Math.round(Math.random() * 40 + 40),
          wind_speed_kmh: Math.round(Math.random() * 30 + 5),
          precipitation_chance: Math.round(Math.random() * 100),
          recommendation:
            "Based on current weather patterns, we recommend planning indoor alternatives. Consider having umbrellas available and adjusting outdoor activities accordingly.",
        });

      if (predictionError) throw predictionError;

      toast({
        title: "Event created!",
        description: "Weather prediction has been generated.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary p-4">
      <div className="container mx-auto max-w-2xl py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <GlassCard className="animate-scale-in">
          <div className="flex items-center mb-6">
            <Calendar className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Create New Event</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Summer BBQ Party"
                className="bg-secondary/50 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Outdoor gathering with friends and family..."
                rows={4}
                className="bg-secondary/50 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date & Time</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="bg-secondary/50 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="Central Park, New York"
                className="bg-secondary/50 border-white/10"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default CreateEvent;
