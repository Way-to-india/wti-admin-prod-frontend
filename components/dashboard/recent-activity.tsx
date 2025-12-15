import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconUser, IconStar, IconTicket, IconMail, IconPhone } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  data: {
    users: any[];
    reviews: any[];
    leads: any[];
  };
  showLeadsOnly?: boolean;
}

export function RecentActivity({ data, showLeadsOnly = false }: RecentActivityProps) {
  const users = data?.users || [];
  const reviews = data?.reviews || [];
  const leads = data?.leads || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'default';
      case 'CONTACTED':
        return 'secondary';
      case 'CONVERTED':
        return 'success';
      case 'QUALIFIED':
        return 'default';
      default:
        return 'outline';
    }
  };

  if (showLeadsOnly) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTicket className="h-5 w-5" />
            Recent Leads
          </CardTitle>
          <CardDescription>Latest customer inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No recent leads</div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <div key={lead.id} className="rounded-lg border p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {lead.fullName?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{lead.fullName}</p>
                        <Badge variant={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>{' '}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <IconMail className="h-3 w-3" />
                          {lead.email}
                        </span>
                        {lead.phoneNumber && (
                          <span className="flex items-center gap-1">
                            <IconPhone className="h-3 w-3" />
                            {lead.phoneNumber}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline">{lead.source?.replace('_', ' ')}</Badge>
                        <span className="text-muted-foreground">
                          {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      {lead.assignedTo && (
                        <div className="text-xs text-muted-foreground">
                          Assigned to: {lead.assignedTo.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-4">
      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Recent Users
          </CardTitle>
          <CardDescription>Latest user registrations</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No recent users</div>
          ) : (
            <div className="space-y-3">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback>{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconStar className="h-5 w-5" />
            Recent Reviews
          </CardTitle>
          <CardDescription>Latest customer feedback</CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No recent reviews</div>
          ) : (
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="space-y-2 border-b pb-3 last:border-0">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={review.user?.profileImage} />
                      <AvatarFallback>
                        {review.user?.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{review.user?.name}</p>
                    <div className="ml-auto flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <IconStar
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm font-medium">{review.title}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <span className="truncate text-xs text-muted-foreground">
                      {review.tour?.title}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Leads Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTicket className="h-5 w-5" />
            Recent Leads
          </CardTitle>
          <CardDescription>Latest customer inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No recent leads</div>
          ) : (
            <div className="space-y-3">
              {leads.slice(0, 3).map((lead) => (
                <div key={lead.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{lead.fullName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{lead.fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {lead.source?.replace('_', ' ')}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {lead.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
