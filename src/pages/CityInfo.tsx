import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import {
  Plane,
  Train,
  Bus,
  Calendar,
  MapPin,
  Clock,
  ChevronDown,
  Loader2,
  CalendarDays,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CityEvent {
  id: string;
  title: string;
  type: "flight" | "train" | "bus" | "event";
  time: string;
  location: string;
  details: string;
  passengers?: number;
  terminal?: string;
}

interface HourlyCount {
  hour: string;
  count: number;
  locations: string[];
  totalPassengers: number;
}

const CityInfo = () => {
  const [searchCity, setSearchCity] = useState("Birmingham");
  const [activeTab, setActiveTab] = useState("flights");
  const [arrivals, setArrivals] = useState<CityEvent[]>([]);
  const [transportData, setTransportData] = useState<{
    trains: CityEvent[];
    buses: CityEvent[];
    events: CityEvent[];
  }>({
    trains: [],
    buses: [],
    events: [],
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // UK cities with their transport hubs
  const cityConfig = {
    Birmingham: {
      iata: "BHX",
      airportName: "Birmingham Airport",
    },
    Manchester: {
      iata: "MAN",
      airportName: "Manchester Airport",
    },
    Liverpool: {
      iata: "LPL",
      airportName: "Liverpool John Lennon Airport",
    },
  };

  // Fetch flight data
  const fetchFlightData = async () => {
    const config = cityConfig[searchCity as keyof typeof cityConfig];
    if (!config) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-flight-data`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            iataCode: config.iata,
            date: new Date().toISOString().split("T")[0],
          }),
        }
      );

      const data = await response.json();
      setArrivals(data.flights || []);
    } catch (error) {
      console.error("Flight API error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch flight data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch transport data (trains/buses)
  const fetchTransportData = async (type: "train" | "bus" | "event") => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-transport-data`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "London",
            to: searchCity,
            type: type === "train" ? "train" : "bus",
            date: new Date().toISOString().split("T")[0],
            time: "09:00",
          }),
        }
      );

      const data = await response.json();
      
      if (type === "train") {
        setTransportData(prev => ({ ...prev, trains: data.trains || [] }));
      } else if (type === "bus") {
        setTransportData(prev => ({ ...prev, buses: data.buses || [] }));
      } else if (type === "event") {
        // Mock events data for now
        const mockEvents: CityEvent[] = [
          {
            id: "event-1",
            title: `${searchCity} Symphony Orchestra`,
            type: "event",
            time: "19:30",
            location: `${searchCity} Symphony Hall`,
            details: "Classical Concert",
            passengers: 2100,
          },
          {
            id: "event-2",
            title: "Premier League Match",
            type: "event",
            time: "15:00",
            location: `${searchCity} Stadium`,
            details: "Football Match",
            passengers: 42000,
          },
          {
            id: "event-3",
            title: "Tech Conference 2024",
            type: "event",
            time: "09:00",
            location: `${searchCity} Convention Centre`,
            details: "Technology Summit",
            passengers: 5000,
          },
          {
            id: "event-4",
            title: "West End Musical",
            type: "event",
            time: "20:00",
            location: `${searchCity} Theatre Royal`,
            details: "Musical Performance",
            passengers: 1800,
          },
        ];
        setTransportData(prev => ({ ...prev, events: mockEvents }));
      }
    } catch (error) {
      console.error(`${type} API error:`, error);
      toast({
        title: "Error",
        description: `Failed to fetch ${type} data`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Process flight data into hourly counts
  const flightData = useMemo(() => {
    const counts: Record<string, HourlyCount> = {};

    arrivals.forEach((arrival) => {
      const hour = arrival.time.split(":")[0] + ":00";
      if (!counts[hour]) {
        counts[hour] = {
          hour,
          count: 0,
          locations: [],
          totalPassengers: 0,
        };
      }
      counts[hour].count += 1;
      counts[hour].totalPassengers += arrival.passengers || 0;
      if (!counts[hour].locations.includes(arrival.location)) {
        counts[hour].locations.push(arrival.location);
      }
    });

    return Object.values(counts).sort((a, b) => a.hour.localeCompare(b.hour));
  }, [arrivals]);

  const cities = Object.keys(cityConfig);

  // Fetch data when city or tab changes
  useEffect(() => {
    if (activeTab === "flights") {
      fetchFlightData();
    } else if (activeTab === "trains") {
      fetchTransportData("train");
    } else if (activeTab === "buses") {
      fetchTransportData("bus");
    } else if (activeTab === "events") {
      fetchTransportData("event");
    }
  }, [searchCity, activeTab]);

  const getIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="w-4 h-4" />;
      case "train":
        return <Train className="w-4 h-4" />;
      case "bus":
        return <Bus className="w-4 h-4" />;
      case "event":
        return <CalendarDays className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "flight":
        return "bg-blue-100 text-blue-800";
      case "train":
        return "bg-green-100 text-green-800";
      case "bus":
        return "bg-orange-100 text-orange-800";
      case "event":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  const tabData = [
    {
      id: "flights",
      label: "Flights",
      icon: Plane,
      data: flightData,
      isTransport: true,
    },
    {
      id: "trains",
      label: "Trains",
      icon: Train,
      data: transportData.trains.map((train) => ({
        hour: train.time,
        count: 1,
        locations: [train.location],
        totalPassengers: train.passengers || 0,
        type: train.type,
        title: train.title,
        details: train.details,
      })),
      isTransport: false,
    },
    {
      id: "buses",
      label: "Buses",
      icon: Bus,
      data: transportData.buses.map((bus) => ({
        hour: bus.time,
        count: 1,
        locations: [bus.location],
        totalPassengers: bus.passengers || 0,
        type: bus.type,
        title: bus.title,
        details: bus.details,
      })),
      isTransport: false,
    },
    {
      id: "events",
      label: "Events",
      icon: CalendarDays,
      data: transportData.events.map((event) => ({
        hour: event.time,
        count: 1,
        locations: [event.location],
        totalPassengers: event.passengers || 0,
        type: event.type,
        title: event.title,
        details: event.details,
      })),
      isTransport: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* City Selection */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-white/90">
              Select City
            </label>
            <Select value={searchCity} onValueChange={setSearchCity}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white h-11 sm:h-10">
                <SelectValue placeholder="Choose your city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current City */}
          <GradientCard
            variant="card"
            className="bg-white/10 backdrop-blur-sm border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Current Location</p>
                <p className="text-xl font-bold text-white">{searchCity}</p>
              </div>
              <MapPin className="w-6 h-6 text-white/60" />
            </div>
          </GradientCard>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6">

        {/* Modern Tab Selectors */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {tabData.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 touch-manipulation
                ${
                  activeTab === tab.id
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-border bg-card hover:border-primary/30 hover:bg-accent/50"
                }
              `}
            >
              {activeTab === tab.id && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse" />
              )}
              <div
                className={`
                w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/20"
                }
              `}
              >
                <tab.icon className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <span
                className={`
                text-xs sm:text-sm font-medium transition-colors duration-300 text-center
                ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              `}
              >
                {tab.label}
              </span>
              <div
                className={`
                w-6 h-0.5 sm:w-8 sm:h-1 rounded-full transition-all duration-300
                ${activeTab === tab.id ? "bg-primary" : "bg-transparent"}
              `}
              />
            </button>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {tabData.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-4">
              {loading && activeTab === tab.id ? (
                <GradientCard className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">
                    Loading {tab.label.toLowerCase()}...
                  </p>
                </GradientCard>
              ) : tab.data.length === 0 ? (
                <GradientCard className="text-center py-8">
                  <tab.icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2 text-primary">
                    No {tab.label.toLowerCase()} found
                  </h3>
                  <p className="text-muted-foreground">
                    No {tab.label.toLowerCase()} scheduled for {searchCity}{" "}
                    today
                  </p>
                </GradientCard>
              ) : (
                <div className="space-y-3">
                  {tab.isTransport ? (
                    // Hourly grouped view for flights
                    tab.data.map((hourlyData, index) => (
                      <GradientCard
                        key={index}
                        className="hover:shadow-soft transition-shadow"
                      >
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  className={getTypeColor(tab.id)}
                                >
                                  {getIcon(tab.id)}
                                  <span className="ml-1 capitalize">
                                    {tab.label}
                                  </span>
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {hourlyData.count}{" "}
                                  {hourlyData.count === 1
                                    ? "arrival"
                                    : "arrivals"}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-lg">
                                {hourlyData.hour}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {hourlyData.count} {tab.label.toLowerCase()}{" "}
                                arriving this hour
                              </p>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm font-medium mb-1">
                                <Clock className="w-4 h-4" />
                                {hourlyData.hour}
                              </div>
                              <p className="text-2xl font-bold text-primary">
                                {hourlyData.count}
                              </p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {hourlyData.locations.length === 1
                                  ? hourlyData.locations[0]
                                  : `${hourlyData.locations.length} locations`}
                              </span>
                            </div>
                            {hourlyData.locations.length > 1 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {hourlyData.locations.map((location, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {location}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </GradientCard>
                    ))
                  ) : (
                    // Individual items for trains/buses
                    tab.data.map((item, index) => (
                      <GradientCard
                        key={index}
                        className="hover:shadow-soft transition-shadow"
                      >
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  className={getTypeColor(item.type || tab.id)}
                                >
                                  {getIcon(item.type || tab.id)}
                                  <span className="ml-1">
                                    {item.title || tab.label}
                                  </span>
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-lg">
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {item.details}
                              </p>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm font-medium mb-1">
                                <Clock className="w-4 h-4" />
                                {formatTime(item.hour)}
                              </div>
                              <p className="text-2xl font-bold text-primary">
                                {item.totalPassengers}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                passengers
                              </p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{item.locations[0]}</span>
                            </div>
                          </div>
                        </div>
                      </GradientCard>
                    ))
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default CityInfo;