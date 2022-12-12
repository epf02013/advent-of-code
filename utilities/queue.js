class Queue {
  constructor(item) {
    const head = { value: item, next: null };
    this.head = head;
    this.tail = head;
  }
  empty() {
    const head = this.head;
    return !head;
  }
  pop() {
    const prevHead = this.head;
    this.head = this.head?.next;
    return prevHead?.value;
  }
  push(item) {
    const tail = {
      next: null,
      value: item,
    };
    if (!this.tail || !this.head) {
      this.tail = tail;
      this.head = tail;
    } else {
      this.tail.next = tail;
      this.tail = tail;
    }
  }
}

module.exports = {
  Queue,
};
