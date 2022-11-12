<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        @{{ freet.author }}
      </h3>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    

    <section>
      
      <textarea
        :value="commentContent"
        @input="commentContent = $event.target.value"
      />
      <br>
      <button @click="submitComment">
        Create Comment
      </button>
    <!-- <CreateCommentForm/> -->
    </section>
  <br>
    <!-- <section
        v-if="seeCommentsToggle"
      >
        <CommentComponent
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
        />
      </section> -->


    <section
      v-if="notLiked" >
    <button @click="like">
      Like
    </button>
    </section>

    <p
      v-else
    >
      You liked this freet!
    </p>


    <button @click="getComments">
      See Comments 
    </button>
    <section
        v-if="seeCommentsToggle"
      >
        <CommentComponent
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
        />
      </section>
    <!-- loop through comments, render them here using v-for -->

    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>

    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
//import Comment Component
import CommentComponent from '@/components/Comment/CommentComponent.vue';
import CreateCommentForm from '@/components/Comment/CreateCommentForm.vue';
export default {
  name: 'FreetComponent',
  components: {CommentComponent, CreateCommentForm},
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      comments: [],
      commentContent: "",
      seeCommentsToggle: false,
      notLiked: true,
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },

  methods: {

    

    submitComment(){

      notLiked = false;

      const params = {
        method: 'POST',
        message: 'Successfully commented on a freet',
        body: JSON.stringify({content: this.commentContent}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };

      this.postComment(params);

    },

    async postComment(params){
        const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/comment/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        //this.editing = false;
        //this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },

    like(){

      const params = {
        method: 'POST',
        message: 'Successfully liked freet!',
        body: JSON.stringify({reaction: "Like"}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };

      this.postLike(params);      
    },

    async postLike(params){
        const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/react/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          console.log(res);
          throw new Error("You already liked this freet!");
        }

        //this.editing = false;
        //this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },

    getComments() {

      this.seeCommentsToggle = !this.seeCommentsToggle;
      console.log("toggle");
      console.log(this.seeCommentsToggle);
      const params = {
        method: 'GET',
        message: 'Successfully got comments!',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.requestComments(params);
    },

    async requestComments(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/comment?originalFreetId=${this.freet._id}`, options);
        //console.log(r.json());
        //console.log("freetspagecomments");
        //console.log(typeof(r));
        // comments = await r.json();
        const res = await r.json();
        //console.log(res);
        this.comments= res;
        //console.log(comments);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        // this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },

    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
    color: #10104f;
    background-color: #E6E6FA;
    width: 100%;
    border-radius: 20px;
    margin-bottom: 10px;
}

.content {
  color: #10104f;
  font-size: 25px;
  border: 5px;
  border-color: #10104f;
}

.actions {
  align-content: right;
}

.info {
  align-items: right;
  font-size: 15px;
}


</style>
