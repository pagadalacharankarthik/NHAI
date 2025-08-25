"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Lock, Camera, MessageCircle, QrCode, MapPin, Star, Send, Globe } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { FileUpload } from "@/components/ui/file-upload"

interface CitizenPortalProps {
  user: any
}

export function CitizenPortal({ user }: CitizenPortalProps) {
  const [selectedFacility, setSelectedFacility] = useState("")
  const [feedbackType, setFeedbackType] = useState("")
  const [comments, setComments] = useState("")
  const [rating, setRating] = useState(0)
  const [language, setLanguage] = useState("english")
  const [photos, setPhotos] = useState<File[]>([])

  const { facilities, submitFeedback, feedback } = useAppStore()

  const feedbackOptions = [
    {
      type: "clean",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      label: "Clean",
      labelHindi: "साफ",
      labelTelugu: "శుభ్రం",
      description: "Facility is clean and well-maintained",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
    },
    {
      type: "dirty",
      icon: <XCircle className="h-8 w-8 text-red-600" />,
      label: "Dirty",
      labelHindi: "गंदा",
      labelTelugu: "మురికి",
      description: "Facility needs cleaning",
      color: "bg-red-50 border-red-200 hover:bg-red-100",
    },
    {
      type: "locked",
      icon: <Lock className="h-8 w-8 text-yellow-600" />,
      label: "Locked/Broken",
      labelHindi: "बंद/टूटा",
      labelTelugu: "లాక్/విరిగిన",
      description: "Facility is not accessible",
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    },
  ]

  const recentFeedback = feedback.slice(0, 3).map((fb) => ({
    facility: fb.facilityName,
    type: fb.type,
    time: new Date(fb.timestamp).toLocaleString(),
    comment: fb.comments || "No comment provided",
  }))

  const handleFeedbackSubmit = () => {
    if (selectedFacility && feedbackType) {
      const selectedFacilityData = facilities.find((f) => f.id === selectedFacility)

      submitFeedback({
        facilityId: selectedFacility,
        facilityName: selectedFacilityData?.name || "Unknown Facility",
        type: feedbackType as "clean" | "dirty" | "locked",
        rating: rating || undefined,
        comments: comments || undefined,
        photos: photos.map((file) => file.name),
        userId: user.id,
      })

      setSelectedFacility("")
      setFeedbackType("")
      setComments("")
      setRating(0)
      setPhotos([])
    }
  }

  const getLanguageText = (english: string, hindi: string, telugu: string) => {
    switch (language) {
      case "hindi":
        return hindi
      case "telugu":
        return telugu
      default:
        return english
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "clean":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "dirty":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "locked":
        return <Lock className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">NH</span>
            </div>
            <div>
              <h1 className="font-semibold text-primary">NHAI Feedback Portal</h1>
              <p className="text-xs text-muted-foreground">
                {getLanguageText("Highway Toilet Feedback", "राजमार्ग शौचालय प्रतिक्रिया", "హైవే టాయిలెట్ ఫీడ్‌బ్యాక్")}
              </p>
            </div>
          </div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">हिंदी</SelectItem>
              <SelectItem value="telugu">తెలుగు</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Tabs defaultValue="feedback" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feedback">
              {getLanguageText("Submit Feedback", "प्रतिक्रिया दें", "అభిప్రాయం ఇవ్వండి")}
            </TabsTrigger>
            <TabsTrigger value="status">{getLanguageText("Facility Status", "सुविधा स्थिति", "సౌకర్య స్థితి")}</TabsTrigger>
            <TabsTrigger value="whatsapp">{getLanguageText("WhatsApp Bot", "व्हाट्सऐप बॉट", "వాట్సాప్ బాట్")}</TabsTrigger>
          </TabsList>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5" />
                  <span>{getLanguageText("Quick Feedback", "त्वरित प्रतिक्रिया", "త్వరిత అభిప్రాయం")}</span>
                </CardTitle>
                <CardDescription>
                  {getLanguageText(
                    "Help us maintain clean and accessible toilet facilities on highways",
                    "राजमार्गों पर स्वच्छ और सुलभ शौचालय सुविधाओं को बनाए रखने में हमारी सहायता करें",
                    "హైవేలలో శుభ్రమైన మరియు అందుబాటులో ఉండే టాయిలెట్ సౌకర్యాలను నిర్వహించడంలో మాకు సహాయం చేయండి",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>{getLanguageText("Select Facility Location", "सुविधा स्थान चुनें", "సౌకర్య స్థానాన్ని ఎంచుకోండి")}</Label>
                  <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={getLanguageText(
                          "Choose the toilet facility",
                          "शौचालय सुविधा चुनें",
                          "టాయిలెట్ సౌకర్యాన్ని ఎంచుకోండి",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {facilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(facility.status)}
                            <span>{facility.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>
                    {getLanguageText(
                      "How would you rate this facility?",
                      "आप इस सुविधा को कैसे रेट करेंगे?",
                      "మీరు ఈ సౌకర్యాన్ని ఎలా రేట్ చేస్తారు?",
                    )}
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {feedbackOptions.map((option) => (
                      <button
                        key={option.type}
                        onClick={() => setFeedbackType(option.type)}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${option.color} ${
                          feedbackType === option.type ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          {option.icon}
                          <div>
                            <div className="font-medium">
                              {getLanguageText(option.label, option.labelHindi, option.labelTelugu)}
                            </div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    {getLanguageText("Overall Rating (Optional)", "समग्र रेटिंग (वैकल्पिक)", "మొత్తం రేటింగ్ (ఐచ్ఛికం)")}
                  </Label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)} className="p-1">
                        <Star
                          className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    {getLanguageText(
                      "Additional Comments (Optional)",
                      "अतिरिक्त टिप्पणी (वैकल्पिक)",
                      "అదనపు వ్యాఖ్యలు (ఐచ్ఛికం)",
                    )}
                  </Label>
                  <Textarea
                    placeholder={getLanguageText(
                      "Share your experience or suggestions...",
                      "अपना अनुभव या सुझाव साझा करें...",
                      "మీ అనుభవం లేదా సూచనలను పంచుకోండి...",
                    )}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{getLanguageText("Add Photo (Optional)", "फोटो जोड़ें (वैकल्पिक)", "ఫోటో జోడించండి (ఐచ్ఛికం)")}</Label>
                  <FileUpload onFilesSelected={setPhotos} maxFiles={3} acceptedTypes={["image/*"]}>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Camera className="h-4 w-4 mr-2" />
                      {getLanguageText("Take Photo", "फोटो लें", "ఫోటో తీయండి")} ({photos.length}/3)
                    </Button>
                  </FileUpload>
                </div>

                <Button
                  onClick={handleFeedbackSubmit}
                  disabled={!selectedFacility || !feedbackType}
                  className="w-full"
                  size="lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {getLanguageText("Submit Feedback", "प्रतिक्रिया जमा करें", "అభిప్రాయం సమర్పించండి")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{getLanguageText("Live Facility Status", "लाइव सुविधा स्थिति", "లైవ్ సౌకర్య స్థితి")}</CardTitle>
                <CardDescription>
                  {getLanguageText(
                    "Real-time status of highway toilet facilities",
                    "राजमार्ग शौचालय सुविधाओं की वास्तविक समय स्थिति",
                    "హైవే టాయిలెట్ సౌకర్యాల రియల్ టైమ్ స్థితి",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {facilities.map((facility) => (
                    <div key={facility.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{facility.name}</h3>
                          <p className="text-sm text-muted-foreground">Last cleaned: {facility.lastCleaned}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(facility.status)}
                        <Badge
                          variant={
                            facility.status === "clean"
                              ? "default"
                              : facility.status === "dirty"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {getLanguageText(
                            facility.status === "clean"
                              ? "Clean"
                              : facility.status === "dirty"
                                ? "Needs Cleaning"
                                : "Locked",
                            facility.status === "clean" ? "साफ" : facility.status === "dirty" ? "सफाई चाहिए" : "बंद",
                            facility.status === "clean" ? "శుభ్రం" : facility.status === "dirty" ? "శుభ్రత అవసరం" : "లాక్",
                          )}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {getLanguageText("Recent Community Feedback", "हाल की सामुदायिक प्रतिक्रिया", "ఇటీవలి కమ్యూనిటీ ఫీడ్‌బ్యాక్")}
                </CardTitle>
                <CardDescription>
                  {getLanguageText(
                    "What other travelers are saying",
                    "अन्य यात्री क्या कह रहे हैं",
                    "ఇతర ప్రయాణికులు ఏమి చెబుతున్నారు",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentFeedback.length > 0 ? (
                    recentFeedback.map((feedback, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                        {feedback.type === "clean" ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        ) : feedback.type === "dirty" ? (
                          <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                        ) : (
                          <Lock className="h-4 w-4 text-yellow-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{feedback.facility}</h4>
                            <span className="text-xs text-muted-foreground">{feedback.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No recent feedback available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>{getLanguageText("WhatsApp Feedback Bot", "व्हाट्सऐप फीडबैक बॉट", "వాట్సాప్ ఫీడ్‌బ్యాక్ బాట్")}</span>
                </CardTitle>
                <CardDescription>
                  {getLanguageText(
                    "Send quick feedback via WhatsApp message",
                    "व्हाट्सऐप संदेश के माध्यम से त्वरित प्रतिक्रिया भेजें",
                    "వాట్సాప్ సందేశం ద్వారా త్వరిత అభిప్రాయం పంపండి",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-800 mb-2">
                    {getLanguageText(
                      "How to use WhatsApp Bot:",
                      "व्हाट्सऐप बॉट का उपयोग कैसे करें:",
                      "వాట్సాప్ బాట్‌ను ఎలా ఉపయోగించాలి:",
                    )}
                  </h3>
                  <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                    <li>
                      {getLanguageText(
                        "Save this number: +91-9876543210",
                        "इस नंबर को सेव करें: +91-9876543210",
                        "ఈ నంబర్‌ను సేవ్ చేయండి: +91-9876543210",
                      )}
                    </li>
                    <li>
                      {getLanguageText(
                        "Send location + status (e.g., 'NH1 KM45 Clean')",
                        "स्थान + स्थिति भेजें (जैसे, 'NH1 KM45 साफ')",
                        "లొకేషన్ + స్థితిని పంపండి (ఉదా., 'NH1 KM45 శుభ్రం')",
                      )}
                    </li>
                    <li>{getLanguageText("Get instant confirmation", "तत्काल पुष्टि प्राप्त करें", "తక్షణ నిర్ధారణ పొందండి")}</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">{getLanguageText("Quick Commands:", "त्वरित कमांड:", "త్వరిత కమాండ్‌లు:")}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                      <div className="font-medium text-green-800">{getLanguageText("Clean", "साफ", "శుభ్రం")}</div>
                      <div className="text-xs text-green-600">
                        {getLanguageText("Facility is clean", "सुविधा साफ है", "సౌకర్యం శుభ్రంగా ఉంది")}
                      </div>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                      <div className="font-medium text-red-800">{getLanguageText("Dirty", "गंदा", "మురికి")}</div>
                      <div className="text-xs text-red-600">
                        {getLanguageText("Needs cleaning", "सफाई चाहिए", "శుభ్రత అవసరం")}
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                      <div className="font-medium text-yellow-800">{getLanguageText("Locked", "बंद", "లాక్")}</div>
                      <div className="text-xs text-yellow-600">
                        {getLanguageText("Not accessible", "पहुंच योग्य नहीं", "అందుబాటులో లేదు")}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    const message = encodeURIComponent("Hello! I want to report toilet facility status.")
                    window.open(`https://wa.me/919876543210?text=${message}`, "_blank")
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {getLanguageText("Open WhatsApp", "व्हाट्सऐप खोलें", "వాట్సాప్ తెరవండి")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
