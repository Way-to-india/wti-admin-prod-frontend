import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Faq } from '@/types/tour.types';
import { GripVertical, HelpCircle, Plus, Trash2 } from 'lucide-react';

interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  order: number;
}

interface FaqTabProps {
  faqs: Faq[];
  setFaqs: (value: Faq[]) => void;
}

export function FaqTab({ faqs, setFaqs }: FaqTabProps) {
  // Flatten FAQs for easier editing
  const flatFaqs: FaqItem[] =
    faqs.length > 0 && faqs[0].questions
      ? faqs[0].questions.map((q) => ({
          id: q.id,
          question: q.question,
          answer: q.answer,
          order: q.order,
        }))
      : [];

  const updateFlatFaqs = (newFlatFaqs: FaqItem[]) => {
    const faqRecord: Faq = {
      id: faqs[0]?.id,
      isActive: faqs[0]?.isActive ?? true,
      questions: newFlatFaqs.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        order: f.order,
      })),
    };
    setFaqs([faqRecord]);
  };

  const addFaq = () => {
    const newOrder = flatFaqs.length > 0 ? Math.max(...flatFaqs.map((f) => f.order)) + 1 : 1;
    updateFlatFaqs([...flatFaqs, { question: '', answer: '', order: newOrder }]);
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...flatFaqs];
    updated[index][field] = value;
    updateFlatFaqs(updated);
  };

  const removeFaq = (index: number) => {
    const updated = flatFaqs.filter((_, i) => i !== index);
    // Reorder remaining FAQs
    const reordered = updated.map((faq, idx) => ({ ...faq, order: idx + 1 }));
    updateFlatFaqs(reordered);
  };

  const moveFaq = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === flatFaqs.length - 1)
    ) {
      return;
    }

    const updated = [...flatFaqs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];

    // Update order numbers
    const reordered = updated.map((faq, idx) => ({ ...faq, order: idx + 1 }));
    updateFlatFaqs(reordered);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Manage common questions and answers to help travelers learn more about this tour
              </CardDescription>
            </div>
            <Button className="cursor-pointer" type="button" onClick={addFaq} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {flatFaqs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
              <HelpCircle className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-4 text-muted-foreground">No FAQs added yet</p>
              <Button className="cursor-pointer" type="button" onClick={addFaq} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add First FAQ
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {flatFaqs.map((faq, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header with controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveFaq(index, 'up')}
                              disabled={index === 0}
                              className="h-6 w-6 cursor-pointer p-0"
                            >
                              ▲
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveFaq(index, 'down')}
                              disabled={index === flatFaqs.length - 1}
                              className="h-6 w-6 cursor-pointer p-0"
                            >
                              ▼
                            </Button>
                          </div>
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            FAQ #{index + 1}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFaq(index)}
                          className="cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Question */}
                      <div className="space-y-2">
                        <Label htmlFor={`faq-question-${index}`}>
                          Question <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`faq-question-${index}`}
                          value={faq.question}
                          onChange={(e) => updateFaq(index, 'question', e.target.value)}
                          placeholder="Enter the question..."
                          className="font-medium"
                        />
                      </div>

                      {/* Answer */}
                      <div className="space-y-2">
                        <Label htmlFor={`faq-answer-${index}`}>
                          Answer <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id={`faq-answer-${index}`}
                          value={faq.answer}
                          onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                          placeholder="Enter the answer..."
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
