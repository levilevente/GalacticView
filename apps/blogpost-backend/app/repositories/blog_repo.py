from mypy_boto3_dynamodb.service_resource import Table

class BlogRepository:
    """
    A repository class responsible for all interactions with the DynamoDB table for blog posts.
    """
    def __init__(self, table: Table):
        self.table = table

    def create_post(self, post_dict: dict) -> dict:
        """
        Saves a new blog post to the DynamoDB table.
        """
        self.table.put_item(Item=post_dict)
        return post_dict

    def get_all_posts(self) -> list:
        """
        Fetches all blog posts from the DynamoDB table.
        """
        # Note: Scan is fine for starting out. 
        # For massive datasets later, this will be upgraded to Query/Pagination.
        response = self.table.scan()
        return response.get('Items', [])

    def get_post_by_id(self, post_id: str) -> dict | None:
        """
        Fetches a single blog post by ID. Returns None if not found.
        """
        response = self.table.get_item(Key={'id': post_id})
        return response.get('Item')

    def delete_post(self, post_id: str) -> dict:
        """
        Deletes a blog post from the DynamoDB table by ID.
        """
        self.table.delete_item(Key={'id': post_id})
        return {'id': post_id, 'status': 'deleted'}