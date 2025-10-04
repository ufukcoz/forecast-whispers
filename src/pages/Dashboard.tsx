import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Calendar, MapPin, Thermometer, Cloud } from "lucide-react";
import weatherHero from "@/assets/weather-hero.jpg";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  created_at: string;
}

interface WeatherPrediction {
  id: string;
  event_id: string;
  temperature_celsius: number;
  conditions: string;
  humidity_percent: number;
  wind_speed_kmh: number;
  precipitation_chance: number;
  recommendation: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [predictions, setPredictions] = useState<Record<string, WeatherPrediction>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadEvents(session.user.id);
      } else {
        navigate("/auth");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadEvents(session.user.id);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadEvents = async (userId: string) => {
    setLoading(true);
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", userId)
        .order("event_date", { ascending: true });

      if (eventsError) throw eventsError;

      setEvents(eventsData || []);

      // Load predictions for events
      if (eventsData && eventsData.length > 0) {
        const { data: predictionsData, error: predictionsError } = await supabase
          .from("weather_predictions")
          .select("*")
          .in("event_id", eventsData.map(e => e.id));

        if (predictionsError) throw predictionsError;

        const predMap: Record<string, WeatherPrediction> = {};
        predictionsData?.forEach((pred) => {
          predMap[pred.event_id] = pred;
        });
        setPredictions(predMap);
      }
    } catch (error: any) {
      toast({
        title: "Error loading events",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={weatherHero}
          alt="Weather background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <GlassCard className="max-w-2xl text-center animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">Weather Forecast</h1>
            <p className="text-xl text-muted-foreground mb-2">Central Jakarta</p>
            <div className="text-6xl font-bold my-6">10°C</div>
            <p className="text-lg text-muted-foreground">Storm with Heavy Rain</p>
          </GlassCard>
        </div>

        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 backdrop-blur-md bg-card/50 border-white/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Events Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Your Events</h2>
          <Button onClick={() => navigate("/create-event")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your events...</p>
          </div>
        ) : events.length === 0 ? (
          <GlassCard className="text-center py-12">
            <Cloud className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first event to get weather predictions
            </p>
            <Button onClick={() => navigate("/create-event")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </GlassCard>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const prediction = predictions[event.id];
              return (
                <GlassCard key={event.id} className="hover-scale">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    </div>

                    {prediction && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Thermometer className="h-5 w-5 mr-2 text-primary" />
                            <span className="text-2xl font-bold">
                              {prediction.temperature_celsius}°C
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {prediction.conditions}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div>Humidity: {prediction.humidity_percent}%</div>
                          <div>Wind: {prediction.wind_speed_kmh} km/h</div>
                          <div className="col-span-2">
                            Rain: {prediction.precipitation_chance}%
                          </div>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                          <p className="text-sm">{prediction.recommendation}</p>
                        </div>
                      </div>
                    )}

                    {!prediction && (
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-sm text-muted-foreground italic">
                          Weather prediction pending...
                        </p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
