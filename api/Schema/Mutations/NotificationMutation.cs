using api.Entities;
using api.Requests;
using api.Services;

namespace api.Schema.Mutations
{
    [ExtendObjectType("Mutation")]
    public class NotificationMutation
    {
        private readonly NotificationService _notificationService;
        public NotificationMutation(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }
        public async Task<string> ReadNotification(NotificationRequest notification)
        {
            return await _notificationService.ReadNotification(notification);
        }

        public async Task<List<Notification>> IsReadAll(int id)
        {
            return await _notificationService.IsReadAll(id);
        }
    }
}
