import { Chatbot } from "@/components/chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Lightbulb } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="p-6 space-y-6" data-testid="page-chat">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">AI Nutrition Assistant</h1>
        <p className="text-muted-foreground">
          Chat with your personal nutrition guide for meal advice and health tips
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Chatbot />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-primary" />
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium text-sm mb-1">Ask about meals</p>
                <p className="text-xs text-muted-foreground">
                  Get nutritional info and health benefits
                </p>
              </div>
              <div>
                <p className="font-medium text-sm mb-1">Recipe suggestions</p>
                <p className="text-xs text-muted-foreground">
                  Find recipes based on your goals
                </p>
              </div>
              <div>
                <p className="font-medium text-sm mb-1">Health questions</p>
                <p className="text-xs text-muted-foreground">
                  Get personalized nutrition advice
                </p>
              </div>
              <div>
                <p className="font-medium text-sm mb-1">Diet planning</p>
                <p className="text-xs text-muted-foreground">
                  Plan weekly meals and meal prep
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5 text-primary" />
                Assistant Info
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Your AI nutrition assistant is trained to help you make better
                dietary choices based on Filipino cuisine and local ingredients.
              </p>
              <p>
                It provides personalized recommendations aligned with SDG 3: Good
                Health and Well-Being.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
