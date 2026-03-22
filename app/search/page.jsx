"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, User, Briefcase, FileText, Hash, Loader2 } from "lucide-react";

// Simple debounce hook implementation
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const mockSearchResults = [
    { id: "1", type: "profile", title: "John Doe", subtitle: "Tutoring Provider", image_url: null },
    { id: "2", type: "service", title: "Math Tutoring", subtitle: "Expert tutoring in mathematics", image_url: null },
    { id: "3", type: "post", title: "Need help with calculus", subtitle: "Looking for calculus homework help", image_url: null },
    { id: "4", type: "topic", title: "#tutoring", subtitle: "Browse tutoring related posts", image_url: null },
    { id: "5", type: "category", title: "Academic Services", subtitle: "All tutoring and academic help", image_url: null },
  ];

  const { data: results, isLoading } = useQuery({
    queryKey: ["global-search", debouncedSearchTerm],
    queryFn: async () => {
      if (debouncedSearchTerm.length < 2) return [];
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const searchLower = debouncedSearchTerm.toLowerCase();
      return mockSearchResults.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(searchLower))
      );
    },
    enabled: debouncedSearchTerm.length >= 2,
  });

  const getIcon = (type) => {
    switch (type) {
      case "profile":
        return <User className="w-5 h-5 text-gray-400" />;
      case "service":
        return <Briefcase className="w-5 h-5 text-gray-400" />;
      case "post":
        return <FileText className="w-5 h-5 text-gray-400" />;
      case "category":
      case "topic":
        return <Hash className="w-5 h-5 text-gray-400" />;
      default:
        return <Search className="w-5 h-5 text-gray-400" />;
    }
  };

  const getLink = (item) => {
    switch (item.type) {
      case "profile":
        return `/providers/${item.id}`;
      case "service":
        return `/services/${item.id}`;
      case "post":
        return `/posts/${item.id}`;
      case "category":
        return `/marketplace?category=${item.id}`;
      case "topic":
        return `/?hashtag=${item.title.replace("#", "")}`;
      default:
        return "#";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search</h1>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg shadow-sm"
            placeholder="Search users, services, posts, topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {results?.map((item) => (
          <a
            key={`${item.type}-${item.id}`}
            href={getLink(item)}
            className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-12 h-12 rounded-full object-cover bg-gray-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  {getIcon(item.type)}
                </div>
              )}

              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                    {item.type}
                  </span>
                </div>
                {item.subtitle && (
                  <p className="mt-1 text-sm text-gray-500">{item.subtitle}</p>
                )}
              </div>
            </div>
          </a>
        ))}

        {!isLoading &&
          debouncedSearchTerm.length >= 2 &&
          results?.length === 0 && (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No results found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                We couldn't find anything matching "{debouncedSearchTerm}"
              </p>
            </div>
          )}

        {!isLoading && debouncedSearchTerm.length < 2 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-1 text-sm text-gray-500">
              Type at least 2 characters to search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
